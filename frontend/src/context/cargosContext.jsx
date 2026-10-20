import { createContext, useContext } from "react";

const CargosContext = createContext();

const cargos = [
    {
        id: "dono", nome: "Dono",
        permissoes: {
            criarTarefa: true, editarTarefa: true, excluirTarefa: true, alterarStatus: true,
            alterarResponsavel: true, alterarData: true, gerenciarMembros: true, gerenciarPermissoes: true
        }
    },
    {
        id: "lider", nome: "Líder",
        permissoes: {
            criarTarefa: true, editarTarefa: true, excluirTarefa: true, alterarStatus: true,
            alterarResponsavel: true, alterarData: true, gerenciarMembros: true, gerenciarPermissoes: false
        }
    },
    {
        id: "membro", nome: "Membro",
        permissoes: {
            criarTarefa: true, editarTarefa: false, excluirTarefa: false, alterarStatus: true,
            alterarResponsavel: false, alterarData: false, gerenciarMembros: false, gerenciarPermissoes: false
        }
    },
    {
        id: "visualizador", nome: "Visualizador",
        permissoes: {
            criarTarefa: false, editarTarefa: false, excluirTarefa: false, alterarStatus: false,
            alterarResponsavel: false, alterarData: false, gerenciarMembros: false, gerenciarPermissoes: false
        }
    }
];

export function CargosProvider({ children }) {
    const buscarCargoPorId = (id) => {
        return cargos.find((cargo) => cargo.id === id);
    };

    return (
        <CargosContext.Provider value={{ cargos, buscarCargoPorId }}>
            {children}
        </CargosContext.Provider>
    );
}

export function useCargos() {
    const context = useContext(CargosContext);

    if (!context) {
        throw new Error("useCargos deve ser usado dentro de um CargosProvider");
    }

    return context;
}