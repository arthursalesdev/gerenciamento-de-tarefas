import { createContext, useContext, useEffect, useState } from "react";
import { useEquipes } from "./equipesContext";

const MembrosContext = createContext();

const CHAVE_MEMBROS = "membrosEquipes";

export function MembrosProvider({ children }) {
    const { transferirDono } = useEquipes();

    const [membros, setMembros] = useState(() => {
        const membrosSalvos = localStorage.getItem(CHAVE_MEMBROS);
        return membrosSalvos ? JSON.parse(membrosSalvos) : [];
    });

    const transferirPropriedade = (equipeId, donoAtualId, novoDonoId) => {
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

        setMembros((membrosAtuais) =>
            membrosAtuais.map((membro) => {
                if (String(membro.equipeId) !== String(equipeId)) {
                    return membro;
                }

                if (String(membro.usuarioId) === String(donoAtualId)) {
                    return {
                        ...membro, cargoId: "membro"
                    };
                }

                if (String(membro.usuarioId) === String(novoDonoId)) {
                    return {
                        ...membro, cargoId: "dono"
                    };
                }

                return membro;
            })
        );

        transferirDono(equipeId, novoDonoId);

        return {
            sucesso: true, mensagem: "Propriedade transferida com sucesso."
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

    const adicionarMembro = (usuarioId, equipeId, cargoId = "membro") => {
        const jaExiste = membros.some(
            (membro) =>
                String(membro.usuarioId) === String(usuarioId) &&
                String(membro.equipeId) === String(equipeId)
        );

        if (jaExiste) {
            return false;
        }

        const novoMembro = {id: Date.now(), usuarioId, equipeId, cargoId};
        setMembros((membrosAtuais) => [...membrosAtuais, novoMembro]);
        return novoMembro;
    };

    const removerMembro = (usuarioId, equipeId) => {
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

        setMembros((membrosAtuais) => membrosAtuais.filter((membroAtual) => !(String(membroAtual.usuarioId) === String(usuarioId) && String(membroAtual.equipeId) === String(equipeId))));

        return {
            sucesso: true
        };
    };

    const alterarCargo = (usuarioId, equipeId, novoCargoId) => {
        setMembros((membrosAtuais) =>
            membrosAtuais.map((membro) =>
                String(membro.usuarioId) === String(usuarioId) &&
                    String(membro.equipeId) === String(equipeId)
                    ? {
                        ...membro, cargoId: novoCargoId
                    }
                    : membro
            )
        );
    };

    const buscarMembrosDaEquipe = (equipeId) => {
        return membros.filter(
            (membro) => String(membro.equipeId) === String(equipeId)
        );
    };

    const buscarEquipesDoUsuario = (usuarioId) => {
        return membros.filter((membro) => String(membro.usuarioId) === String(usuarioId)).map((membro) => membro.equipeId);
    };

    const buscarMembro = (usuarioId, equipeId) => {
        return membros.find(
            (membro) =>
                String(membro.usuarioId) === String(usuarioId) && String(membro.equipeId) === String(equipeId)
        );
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
                membros, adicionarMembro, removerMembro, transferirPropriedade, podeSairDaEquipe,
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