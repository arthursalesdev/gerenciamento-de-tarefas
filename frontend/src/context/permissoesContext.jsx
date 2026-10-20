import { createContext, useContext } from "react";

import { useAuth } from "./authContext";
import { useArea } from "./areaContext";
import { useMembros } from "./membrosContext";
import { useCargos } from "./cargosContext";

const PermissoesContext = createContext();

const permissoesPessoais = {
    criarTarefa: true, editarTarefa: true, excluirTarefa: true, alterarStatus: true,
    alterarResponsavel: true, alterarData: true, gerenciarMembros: false, gerenciarPermissoes: false
};

export function PermissoesProvider({ children }) {
    const { usuarioLogado } = useAuth();
    const { areaAtual, areaPessoalAtiva } = useArea();
    const { buscarMembro } = useMembros();
    const { buscarCargoPorId } = useCargos();

    let permissoes = permissoesPessoais;
    let cargoAtual = null;

    if (!areaPessoalAtiva && usuarioLogado) {
        const membro = buscarMembro(usuarioLogado.id, areaAtual.equipeId);
        cargoAtual = membro ? buscarCargoPorId(membro.cargoId) : null;
        permissoes = cargoAtual?.permissoes || {};
    }

    const pode = (permissao) => {
        return Boolean(permissoes[permissao]);
    };

    return (
        <PermissoesContext.Provider value={{ permissoes, cargoAtual, pode }}>
            {children}
        </PermissoesContext.Provider>
    );
}

export function usePermissoes() {
    const context = useContext(PermissoesContext);

    if (!context) {
        throw new Error("usePermissoes deve ser usado dentro de um PermissoesProvider");
    }

    return context;
}