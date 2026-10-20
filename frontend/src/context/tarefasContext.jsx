import { createContext, useContext, useEffect, useState } from "react";

const TarefasContext = createContext();
const CHAVE_TAREFAS = "tarefas";

export function TarefasProvider({ children }) {
    const [tarefas, setTarefas] = useState(() => {
        const tarefasSalvas = localStorage.getItem(CHAVE_TAREFAS);

        if (!tarefasSalvas) {
            return [];
        }

        const tarefasConvertidas = JSON.parse(tarefasSalvas);

        return Array.isArray(tarefasConvertidas)
            ? tarefasConvertidas
            : [];
    });

    useEffect(() => {
        localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefas));
    }, [tarefas]);

    const criarTarefa = (dados) => {
        const novaTarefa = {
            id: Date.now(),
            titulo: dados.titulo,
            descricao: dados.descricao,
            status: dados.status,
            dataLimite: dados.dataLimite,
            usuarioId: dados.usuarioId,
            equipeId: dados.equipeId
        };

        setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);

        return novaTarefa;
    };

    const atualizarTarefa = (id, dadosAtualizados) => {
        setTarefas((tarefasAtuais) =>
            tarefasAtuais.map((tarefa) =>
                tarefa.id === id
                    ? {
                        ...tarefa, ...dadosAtualizados
                    }
                    : tarefa
            )
        );
    };

    const excluirTarefa = (id) => {
        setTarefas((tarefasAtuais) => tarefasAtuais.filter((tarefa) => tarefa.id !== id));
    };

    const removerResponsavelDaEquipe = (usuarioId, equipeId) => {
        setTarefas((tarefasAtuais) =>
            tarefasAtuais.map((tarefa) =>
                String(tarefa.usuarioId) === String(usuarioId) && String(tarefa.equipeId) === String(equipeId)
                    ? {
                        ...tarefa, usuarioId: null
                    }
                    : tarefa
            )
        );
    };

    return (
        <TarefasContext.Provider value={{ tarefas, criarTarefa, atualizarTarefa, excluirTarefa, removerResponsavelDaEquipe }}>
            {children}
        </TarefasContext.Provider>
    );
}

export function useTarefas() {
    const context = useContext(TarefasContext);

    if (!context) {
        throw new Error("useTarefas deve ser usado dentro de um TarefasProvider");
    }

    return context;
}