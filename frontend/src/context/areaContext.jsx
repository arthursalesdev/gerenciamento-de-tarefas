import { createContext, useContext, useEffect, useState } from "react";

const AreaContext = createContext();
const CHAVE_AREA = "areaAtual";
const areaPessoal = { tipo: "pessoal", equipeId: null, nome: "Minhas Tarefas" };

export function AreaProvider({ children }) {
    const [areaAtual, setAreaAtual] = useState(() => {
        const areaSalva = localStorage.getItem(CHAVE_AREA);
        return areaSalva ? JSON.parse(areaSalva) : areaPessoal;
    });

    useEffect(() => {
        localStorage.setItem(CHAVE_AREA, JSON.stringify(areaAtual));
    }, [areaAtual]);

    const irParaPessoal = () => {
        setAreaAtual(areaPessoal);
    };

    const irParaEquipe = (equipe) => {
        setAreaAtual({tipo: "equipe", equipeId: equipe.id, nome: equipe.nome});
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