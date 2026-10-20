import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./authContext";

const EquipesContext = createContext();
const CHAVE_EQUIPES = "equipes";
const equipesIniciais = [];

export function EquipesProvider({ children }) {
    const { usuarioLogado } = useAuth();

    const [equipes, setEquipes] = useState(() => {
        const equipesSalvas = localStorage.getItem(CHAVE_EQUIPES);
        return equipesSalvas ? JSON.parse(equipesSalvas) : equipesIniciais;
    });

    useEffect(() => {
        localStorage.setItem(CHAVE_EQUIPES, JSON.stringify(equipes));
    }, [equipes]);

    const buscarEquipePorId = (id) => {
        return equipes.find((equipe) => String(equipe.id) === String(id));
    };

    const criarEquipe = (nome) => {
        if (!usuarioLogado) {
            return null;
        }

        const novaEquipe = { id: Date.now(), nome: nome.trim(), donoId: usuarioLogado.id };
        setEquipes((equipesAtuais) => [...equipesAtuais, novaEquipe]);
        return novaEquipe;
    };

    const transferirDono = (equipeId, novoDonoId) => {
        setEquipes((equipesAtuais) =>
            equipesAtuais.map((equipe) =>
                String(equipe.id) === String(equipeId)
                    ? {
                        ...equipe, donoId: novoDonoId
                    }
                    : equipe
            )
        );
    };

    return (
        <EquipesContext.Provider value={{ equipes, buscarEquipePorId, criarEquipe, transferirDono }}>
            {children}
        </EquipesContext.Provider>
    );
}

export function useEquipes() {
    const context = useContext(EquipesContext);

    if (!context) {
        throw new Error("useEquipes deve ser usado dentro de um EquipesProvider");
    }

    return context;
}