import { createContext, useContext, useEffect, useState, useCallback } from "react";

import api from "../services/api";
import { useAuth } from "./authContext";
import { useEquipes } from "./equipesContext";

const MembrosContext = createContext();

const CHAVE_MEMBROS = "membrosEquipes";

export function MembrosProvider({ children }) {
    const { transferirDono, equipesApi } = useEquipes();
    const { usuarioLogado } = useAuth();

    const [membrosApi, setMembrosApi] = useState([]);
    const [carregandoMembros, setCarregandoMembros] = useState(false);
    const [erroMembros, setErroMembros] = useState("");

    const [membros, setMembros] = useState(() => {
        const membrosSalvos = localStorage.getItem(CHAVE_MEMBROS);
        return membrosSalvos ? JSON.parse(membrosSalvos) : [];
    });

    const transferirPropriedade = async (equipeId, donoAtualId, novoDonoId) => {
        const donoAtual = buscarMembro(donoAtualId, equipeId);
        const novoDono = buscarMembro(novoDonoId, equipeId);

        if (!donoAtual || donoAtual.cargoId !== "dono") {
            return {
                sucesso: false, mensagem: "O usuário atual não é o dono da equipe"
            };
        }

        if (!novoDono) {
            return {
                sucesso: false, mensagem: "O novo dono precisa ser membro da equipe"
            };
        }

        if (String(donoAtualId) === String(novoDonoId)) {
            return {
                sucesso: false, mensagem: "Selecione outro membro"
            };
        }

        const equipeReal = equipesApi.some(
            (equipe) => String(equipe.id) === String(equipeId)
        );

        if (!equipeReal) {
            setMembros((atuais) =>
                atuais.map((membro) => {
                    if (String(membro.equipeId) !== String(equipeId)) {
                        return membro;
                    }

                    if (String(membro.usuarioId) === String(donoAtualId)) {
                        return { ...membro, cargoId: "lider" };
                    }

                    if (String(membro.usuarioId) === String(novoDonoId)) {
                        return { ...membro, cargoId: "dono" };
                    }

                    return membro;
                })
            );

            transferirDono(equipeId, novoDonoId);

            return {
                sucesso: true, mensagem: "Propriedade transferida com sucesso"
            };
        }

        try {
            await api.patch(`/equipes/${equipeId}/propriedade`, {
                novoDonoId: Number(novoDonoId)
            });
        } catch (error) {
            return {
                sucesso: false,
                mensagem: error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível transferir a propriedade"
            };
        }

        try {
            await recarregarMembros();
        } catch (error) {
            console.error("Propriedade transferida, mas houve erro ao atualizar os membros:", error);
        }

        return {
            sucesso: true, mensagem: "Propriedade transferida com sucesso"
        };
    };

    const podeSairDaEquipe = (usuarioId, equipeId) => {
        const membro = buscarMembro(usuarioId, equipeId);

        if (!membro) {
            return false;
        }

        return membro.cargoId !== "dono";
    };

    useEffect(() => {
        localStorage.setItem(CHAVE_MEMBROS, JSON.stringify(membros));
    }, [membros]);

    const recarregarMembros = useCallback(async (equipesAtualizadas) => {
        const listaEquipes = equipesAtualizadas ?? equipesApi;

        if (!usuarioLogado?.id || !listaEquipes.length) {
            setMembrosApi([]);
            return [];
        }

        setCarregandoMembros(true);
        setErroMembros("");

        try {
            const respostas = await Promise.all(listaEquipes.map((equipe) => api.get(`/equipes/${equipe.id}/membros`)));
            const lista = respostas.flatMap((resposta, indice) => {
                const dados = resposta.data;

                const integrantes = Array.isArray(dados)
                    ? dados
                    : Array.isArray(dados.membros)
                        ? dados.membros : [];

                return integrantes.map((membro) => ({
                    ...membro,
                    equipeId: listaEquipes[indice].id,
                    cargoId: membro.cargo?.toLowerCase()
                }));
            });

            const idsUsuarios = [
                ...new Set(lista.map((membro) => membro.usuarioId))
            ];

            const resultadosUsuarios = await Promise.allSettled(idsUsuarios.map((id) => api.get(`/usuarios/${id}`)));
            const usuariosPorId = new Map();

            resultadosUsuarios.forEach((resultado, indice) => {
                if (resultado.status === "fulfilled") {
                    usuariosPorId.set(String(idsUsuarios[indice]), resultado.value.data);
                } else {
                    console.error("Não foi possível carregar o usuário:", idsUsuarios[indice], resultado.reason);
                }
            });

            const membrosComUsuarios = lista.map((membro) => ({
                ...membro,
                usuario: usuariosPorId.get(String(membro.usuarioId)) ||
                    (String(membro.usuarioId) === String(usuarioLogado.id)
                        ? usuarioLogado : null)
            }));

            setMembrosApi(membrosComUsuarios);

            return membrosComUsuarios;
        } catch (error) {
            setErroMembros(error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível carregar os membros");
            throw error;
        } finally {
            setCarregandoMembros(false);
        }
    }, [usuarioLogado?.id, equipesApi]);

    useEffect(() => {
        if (!usuarioLogado?.id || !equipesApi.length) {
            setMembrosApi([]);
            setErroMembros("");
            return;
        }

        recarregarMembros().catch(() => { });
    }, [usuarioLogado?.id, equipesApi, recarregarMembros]);

    const adicionarMembro = (usuarioId, equipeId, cargoId = "membro") => {
        const jaExiste = membros.some((membro) => String(membro.usuarioId) === String(usuarioId) && String(membro.equipeId) === String(equipeId));

        if (jaExiste) {
            return false;
        }

        const novoMembro = { id: Date.now(), usuarioId, equipeId, cargoId };
        setMembros((membrosAtuais) => [...membrosAtuais, novoMembro]);
        return novoMembro;
    };

    const removerMembro = async (usuarioId, equipeId) => {
        const membro = buscarMembro(usuarioId, equipeId);

        if (!membro) {
            return {
                sucesso: false, mensagem: "Membro não encontrado."
            };
        }

        if (membro.cargoId === "dono") {
            return {
                sucesso: false, mensagem: "O dono precisa transferir a propriedade antes de sair."
            };
        }

        const equipeReal = equipesApi.some(
            (equipe) => String(equipe.id) === String(equipeId)
        );

        if (!equipeReal) {
            setMembros((atuais) => atuais.filter((item) => !(String(item.usuarioId) === String(usuarioId) && String(item.equipeId) === String(equipeId))));
            return { sucesso: true };
        }

        try {
            const saindoDaEquipe = String(usuarioId) === String(usuarioLogado?.id);
            const endpoint = saindoDaEquipe ? `/equipes/${equipeId}/membros/me` : `/equipes/${equipeId}/membros/${usuarioId}`;
            await api.delete(endpoint);

            setMembros((atuais) => atuais.filter((item) => !(String(item.usuarioId) === String(usuarioId) && String(item.equipeId) === String(equipeId))));

            if (saindoDaEquipe) {
                setMembrosApi((atuais) => atuais.filter((item) => String(item.equipeId) !== String(equipeId)));
            } else {
                await recarregarMembros();
            }

            return { sucesso: true };
        } catch (error) {
            return {
                sucesso: false,
                mensagem: error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível remover o membro"
            };
        }
    };

    const alterarCargo = async (usuarioId, equipeId, novoCargoId) => {
        const equipeReal = equipesApi.some((equipe) => String(equipe.id) === String(equipeId));

        if (!equipeReal) {
            setMembros((atuais) =>
                atuais.map((membro) =>
                    String(membro.usuarioId) === String(usuarioId) &&
                        String(membro.equipeId) === String(equipeId)
                        ? { ...membro, cargoId: novoCargoId }
                        : membro
                )
            );

            return { sucesso: true };
        }

        try {
            await api.patch(`/equipes/${equipeId}/membros/${usuarioId}/cargo`, { cargo: novoCargoId.toUpperCase() });
            await recarregarMembros();
            return { sucesso: true };
        } catch (error) {
            return {
                sucesso: false,
                mensagem: error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível alterar o cargo do membro"
            };
        }
    };

    const buscarMembrosDaEquipe = (equipeId) => {
        if (!usuarioLogado?.id) {
            return [];
        }

        return membrosApi.filter((membro) => String(membro.equipeId) === String(equipeId));
    };

    const buscarEquipesDoUsuario = (usuarioId) => {
        if (!usuarioLogado?.id ||
            String(usuarioLogado.id) !== String(usuarioId)) {
            return [];
        }

        return [
            ...new Set(membrosApi.filter((membro) => String(membro.usuarioId) === String(usuarioId)).map((membro) => membro.equipeId))
        ];
    };

    const buscarMembro = (usuarioId, equipeId) => {
        return buscarMembrosDaEquipe(equipeId).find((membro) => String(membro.usuarioId) === String(usuarioId));
    };

    const podeRemoverMembro = (usuarioAtualId, usuarioAlvoId, equipeId) => {
        const atual = buscarMembro(usuarioAtualId, equipeId);
        const alvo = buscarMembro(usuarioAlvoId, equipeId);

        if (!atual || !alvo) {
            return false;
        }

        if (String(usuarioAtualId) === String(usuarioAlvoId)) {
            return false;
        }

        if (alvo.cargoId === "dono") {
            return false;
        }

        if (atual.cargoId === "dono") {
            return true;
        }

        if (atual.cargoId === "lider" && ["membro", "visualizador"].includes(alvo.cargoId)) {
            return true;
        }

        return false;
    };

    return (
        <MembrosContext.Provider
            value={{
                membros, membrosApi, carregandoMembros, erroMembros, recarregarMembros, adicionarMembro, removerMembro, transferirPropriedade, podeSairDaEquipe,
                podeRemoverMembro, buscarMembrosDaEquipe, buscarEquipesDoUsuario, buscarMembro, alterarCargo
            }}
        >
            {children}
        </MembrosContext.Provider>
    );
}

export function useMembros() {
    const context = useContext(MembrosContext);

    if (!context) {
        throw new Error("useMembros deve ser usado dentro de um MembrosProvider");
    }

    return context;
}