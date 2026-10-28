import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

const AreaContext = createContext();
const areaPessoal = { tipo: "pessoal", equipeId: null, nome: "Minhas Tarefas" };

export function AreaProvider({ children }) {
    const { usuarioLogado, verificandoSessao } = useAuth();
    const [areaAtual, setAreaAtual] = useState(areaPessoal);

    useEffect(() => {
        if (verificandoSessao) return;
        setAreaAtual(areaPessoal);
    }, [usuarioLogado?.id, verificandoSessao]);

    const irParaPessoal = () => {
        setAreaAtual(areaPessoal);
    };

    const irParaEquipe = (equipe) => {
        setAreaAtual({ tipo: "equipe", equipeId: equipe.id, nome: equipe.nome });
    };

    const areaPessoalAtiva = areaAtual.tipo === "pessoal";
    const areaEquipeAtiva = areaAtual.tipo === "equipe";

    return (
        <AreaContext.Provider value={{ areaAtual, areaPessoalAtiva, areaEquipeAtiva, irParaPessoal, irParaEquipe }}>
            {children}
        </AreaContext.Provider>
    );
}

export function useArea() {
    const context = useContext(AreaContext);

    if (!context) {
        throw new Error("useArea deve ser usado dentro de um AreaProvider");
    }

    return context;
}