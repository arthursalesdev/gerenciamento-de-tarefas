import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "./authContext";
import { useEquipes } from "./equipesContext";
import { useMembros } from "./membrosContext";

const TarefasContext = createContext();
const CHAVE_TAREFAS = "tarefas";

const statusParaFrontend = {
    PENDENTE: "pendente", EM_ANDAMENTO: "andamento", CONCLUIDA: "concluido"
};

const statusParaBackend = {
    pendente: "PENDENTE", andamento: "EM_ANDAMENTO", concluido: "CONCLUIDA"
};

function normalizarTarefa(tarefa) {
    return {
        ...tarefa,
        status: statusParaFrontend[tarefa.status] || tarefa.status,
        dataLimite: tarefa.dataLimite ? String(tarefa.dataLimite).slice(0, 10) : "",
        prioridade: tarefa.prioridade || "MEDIA"
    };
}

function lerTarefasLocais() {
    try {
        const salvas = JSON.parse(localStorage.getItem(CHAVE_TAREFAS) || "[]");
        return Array.isArray(salvas) ? salvas : [];
    } catch {
        return [];
    }
}

function mensagemErro(error) {
    return (error.response?.data?.message || error.response?.data?.mensagem || error.message || "Não foi possível salvar a tarefa");
}

export function TarefasProvider({ children }) {
    const { usuarioLogado, verificandoSessao } = useAuth();
    const { equipesApi } = useEquipes();
    const { membrosApi } = useMembros();

    const [tarefasLocais, setTarefasLocais] = useState(lerTarefasLocais);
    const [tarefasApi, setTarefasApi] = useState([]);
    const [tarefasEquipesApi, setTarefasEquipesApi] = useState([]);
    const [carregandoTarefas, setCarregandoTarefas] = useState(false);
    const [erroTarefas, setErroTarefas] = useState("");

    useEffect(() => {
        localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefasLocais));
    }, [tarefasLocais]);

    useEffect(() => {
        if (verificandoSessao) return;

        if (!usuarioLogado) {
            setTarefasApi([]);
            setErroTarefas("");
            return;
        }

        let ativo = true;

        async function carregar() {
            setCarregandoTarefas(true);
            setErroTarefas("");

            try {
                const resposta = await api.get("/tarefas");
                const dados = resposta.data;
                const lista = Array.isArray(dados) ? dados : Array.isArray(dados.tarefas) ? dados.tarefas : [];

                if (ativo) {
                    setTarefasApi(lista.map(normalizarTarefa));
                }
            } catch (error) {
                if (ativo) {
                    setErroTarefas(mensagemErro(error));
                }
            } finally {
                if (ativo) setCarregandoTarefas(false);
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, [usuarioLogado?.id, verificandoSessao]);

    useEffect(() => {
        if (verificandoSessao) return;

        if (!usuarioLogado?.id) {
            setTarefasEquipesApi([]);
            return;
        }

        let ativo = true;

        async function carregarTarefasEquipes() {
            const minhasEquipes = equipesApi.filter((equipe) =>
                membrosApi.some(
                    (membro) =>
                        String(membro.equipeId) === String(equipe.id) &&
                        String(membro.usuarioId) === String(usuarioLogado.id)
                )
            );

            if (!minhasEquipes.length) {
                setTarefasEquipesApi([]);
                return;
            }

            const resultados = await Promise.allSettled(minhasEquipes.map((equipe) => api.get(`/equipes/${equipe.id}/tarefas`)));

            if (!ativo) return;

            const tarefasCompartilhadas = [];
            let houveErro = false;

            resultados.forEach((resultado, indice) => {
                if (resultado.status === "rejected") {
                    houveErro = true;
                    return;
                }

                const dados = resultado.value.data;

                const lista = Array.isArray(dados)
                    ? dados
                    : Array.isArray(dados?.tarefas)
                        ? dados.tarefas : [];

                tarefasCompartilhadas.push(
                    ...lista.map((tarefa) =>
                        normalizarTarefa({
                            ...tarefa,
                            equipeId: minhasEquipes[indice].id
                        })
                    )
                );
            });

            setTarefasEquipesApi(tarefasCompartilhadas);

            if (houveErro) {
                setErroTarefas("Não foi possível atualizar as tarefas de uma ou mais equipes");
            } else {
                setErroTarefas("");
            }
        }

        carregarTarefasEquipes();

        return () => {
            ativo = false;
        };
    }, [usuarioLogado?.id, verificandoSessao, equipesApi, membrosApi]);

    const tarefas = usuarioLogado?.id
        ? [
            ...tarefasApi.map((tarefa) => ({
                ...tarefa, origemPersistencia: "api"
            })),

            ...tarefasEquipesApi.map((tarefa) => ({
                ...tarefa, origemPersistencia: "api"
            }))
        ] : [];

    const criarTarefa = async (dados) => {
        const ehTarefaEquipe = dados.equipeId !== null && dados.equipeId !== undefined;

        const payload = {
            titulo: dados.titulo, descricao: dados.descricao,
            dataLimite: dados.dataLimite || null, prioridade: dados.prioridade || "MEDIA"
        };

        if (ehTarefaEquipe) {
            payload.equipeId = Number(dados.equipeId);

            const responsavelId = dados.responsavelId;

            if (responsavelId !== null && responsavelId !== undefined && responsavelId !== "") {
                payload.responsavelId = Number(responsavelId);
            }
        }

        const resposta = await api.post("/tarefas", payload);
        let tarefaCriada = resposta.data;

        if (!ehTarefaEquipe) {
            if (dados.status && dados.status !== "pendente") {
                const atualizacao = await api.put(`/tarefas/${tarefaCriada.id}`, { status: statusParaBackend[dados.status] });
                tarefaCriada = atualizacao.data;
            }

            const tarefaNormalizada = normalizarTarefa(tarefaCriada);

            setTarefasApi((atuais) => [
                ...atuais,
                tarefaNormalizada
            ]);

            return tarefaNormalizada;
        }

        const tarefaNormalizada = normalizarTarefa(tarefaCriada);

        setTarefasEquipesApi((atuais) => [
            ...atuais,
            tarefaNormalizada
        ]);

        return tarefaNormalizada;
    };

    const atualizarTarefa = async (id, dadosAtualizados, tarefaReferencia) => {
        if (!tarefaReferencia?.origemPersistencia) {
            throw new Error("Origem da tarefa não identificada.");
        }

        const mesmaTarefa = (tarefa) =>
            String(tarefa.id) === String(id) &&
            String(tarefa.equipeId ?? "") ===
            String(tarefaReferencia.equipeId ?? "");

        if (tarefaReferencia.origemPersistencia === "local") {
            const tarefaLocal = tarefasLocais.find(mesmaTarefa);

            if (!tarefaLocal) {
                throw new Error("Tarefa local não encontrada.");
            }

            setTarefasLocais((atuais) =>
                atuais.map((tarefa) =>
                    mesmaTarefa(tarefa)
                        ? { ...tarefa, ...dadosAtualizados }
                        : tarefa
                )
            );

            return;
        }

        if (tarefaReferencia.origemPersistencia !== "api") {
            throw new Error("Origem da tarefa inválida.");
        }

        const payload = {
            titulo: dadosAtualizados.titulo,
            descricao: dadosAtualizados.descricao,
            status: dadosAtualizados.status
                ? statusParaBackend[dadosAtualizados.status]
                : undefined,
            prioridade: dadosAtualizados.prioridade,
            dataLimite: dadosAtualizados.dataLimite || null
        };

        Object.keys(payload).forEach((chave) => {
            if (payload[chave] === undefined) {
                delete payload[chave];
            }
        });

        if (tarefaReferencia.equipeId != null) {
            const tarefaEquipe = tarefasEquipesApi.find(mesmaTarefa);

            if (!tarefaEquipe) {
                throw new Error("Tarefa de equipe não encontrada.");
            }

            const alterouResponsavel =
                Object.prototype.hasOwnProperty.call(dadosAtualizados, "responsavelId") &&
                String(dadosAtualizados.responsavelId ?? "") !==
                String(tarefaEquipe.responsavelId ?? "");

            const resposta = await api.put(`/equipes/${tarefaEquipe.equipeId}/tarefas/${id}`, payload);

            let atualizada = normalizarTarefa(resposta.data);

            setTarefasEquipesApi((atuais) => atuais.map((tarefa) => mesmaTarefa(tarefa) ? atualizada : tarefa));

            if (alterouResponsavel) {
                atualizada = await atualizarResponsavel(id, tarefaEquipe.equipeId, dadosAtualizados.responsavelId);
            }

            return atualizada;
        }

        const tarefaPessoal = tarefasApi.find(mesmaTarefa);

        if (!tarefaPessoal) {
            throw new Error("Tarefa pessoal não encontrada.");
        }

        const resposta = await api.put(`/tarefas/${id}`, payload);
        const atualizada = normalizarTarefa(resposta.data);

        setTarefasApi((atuais) => atuais.map((tarefa) => mesmaTarefa(tarefa) ? atualizada : tarefa));

        return atualizada;
    };

    const atualizarResponsavel = async (tarefaId, equipeId, responsavelId) => {
        const resposta = await api.patch(`/equipes/${equipeId}/tarefas/${tarefaId}/responsavel`, { responsavelId });
        const tarefaAtualizada = normalizarTarefa(resposta.data);

        setTarefasEquipesApi((atuais) =>
            atuais.map((tarefa) =>
                String(tarefa.id) === String(tarefaId) &&
                    String(tarefa.equipeId) === String(equipeId)
                    ? tarefaAtualizada
                    : tarefa
            )
        );

        return tarefaAtualizada;
    };

    const excluirTarefa = async (id, tarefaReferencia) => {
        if (!tarefaReferencia?.origemPersistencia) {
            throw new Error("Origem da tarefa não identificada");
        }

        const mesmaTarefa = (tarefa) =>
            String(tarefa.id) === String(id) &&
            String(tarefa.equipeId ?? "") ===
            String(tarefaReferencia.equipeId ?? "");

        if (tarefaReferencia.origemPersistencia === "local") {
            const tarefaLocal = tarefasLocais.find(mesmaTarefa);

            if (!tarefaLocal) {
                throw new Error("Tarefa local não encontrada");
            }

            setTarefasLocais((atuais) => atuais.filter((tarefa) => !mesmaTarefa(tarefa)));

            return;
        }

        if (tarefaReferencia.origemPersistencia !== "api") {
            throw new Error("Origem da tarefa inválida");
        }

        if (tarefaReferencia.equipeId != null) {
            const tarefaEquipe = tarefasEquipesApi.find(mesmaTarefa);

            if (!tarefaEquipe) {
                throw new Error("Tarefa de equipe não encontrada");
            }

            await api.delete(`/equipes/${tarefaEquipe.equipeId}/tarefas/${id}`);
            setTarefasEquipesApi((atuais) => atuais.filter((tarefa) => !mesmaTarefa(tarefa)));

            return;
        }

        const tarefaPessoal = tarefasApi.find(mesmaTarefa);

        if (!tarefaPessoal) {
            throw new Error("Tarefa pessoal não encontrada");
        }

        await api.delete(`/tarefas/${id}`);
        setTarefasApi((atuais) => atuais.filter((tarefa) => !mesmaTarefa(tarefa)));
    };

    const removerResponsavelDaEquipe = (usuarioId, equipeId) => {
        setTarefasLocais((atuais) =>
            atuais.map((tarefa) =>
                String(tarefa.usuarioId) === String(usuarioId) &&
                    String(tarefa.equipeId) === String(equipeId) ? { ...tarefa, usuarioId: null } : tarefa
            )
        );
    };

    return (
        <TarefasContext.Provider
            value={{ tarefas, criarTarefa, atualizarTarefa, atualizarResponsavel, excluirTarefa, removerResponsavelDaEquipe, carregandoTarefas, erroTarefas }}>
            {children}
        </TarefasContext.Provider>
    );
}

export function useTarefas() {
    const context = useContext(TarefasContext);

    if (!context) {
        throw new Error(
            "useTarefas deve ser usado dentro de um TarefasProvider"
        );
    }

    return context;
}
