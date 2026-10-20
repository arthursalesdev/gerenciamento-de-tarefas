import { createContext, useContext, useEffect, useState } from "react";
import { useMembros } from "./membrosContext";

const ConvitesContext = createContext();
const CHAVE_CONVITES = "convitesEquipes";

export function ConvitesProvider({ children }) {
    const { adicionarMembro, buscarMembro } = useMembros();

    const [convites, setConvites] = useState(() => {
        const convitesSalvos = localStorage.getItem(CHAVE_CONVITES);
        return convitesSalvos ? JSON.parse(convitesSalvos) : [];
    });

    useEffect(() => {
        localStorage.setItem(CHAVE_CONVITES, JSON.stringify(convites));
    }, [convites]);

    const enviarConvite = ({ equipeId, convidadoId, convidadorId, cargoId = "membro" }) => {
        const jaEMembro = buscarMembro(convidadoId, equipeId);

        if (jaEMembro) {
            return {
                sucesso: false, mensagem: "Este usuário já faz parte da equipe."
            };
        }

        const convitePendente = convites.find(
            (convite) =>
                String(convite.equipeId) === String(equipeId) &&
                String(convite.convidadoId) === String(convidadoId) &&
                convite.status === "pendente"
        );

        if (convitePendente) {
            return {
                sucesso: false, mensagem: "Já existe um convite pendente para este usuário."
            };
        }

        const novoConvite = {
            id: Date.now(), equipeId, convidadoId, convidadorId,
            cargoId, status: "pendente", criadoEm: new Date().toISOString()
        };

        setConvites((convitesAtuais) => [...convitesAtuais, novoConvite]);

        return {
            sucesso: true, convite: novoConvite
        };
    };

    const aceitarConvite = (conviteId) => {
        const convite = convites.find((convite) => convite.id === conviteId);

        if (!convite || convite.status !== "pendente") {
            return false;
        }

        adicionarMembro(convite.convidadoId, convite.equipeId, convite.cargoId);

        setConvites((convitesAtuais) =>
            convitesAtuais.map((conviteAtual) =>
                conviteAtual.id === conviteId
                    ? {
                        ...conviteAtual, status: "aceito"
                    }
                    : conviteAtual
            )
        );

        return true;
    };

    const recusarConvite = (conviteId) => {
        setConvites((convitesAtuais) =>
            convitesAtuais.map((convite) =>
                convite.id === conviteId
                    ? {
                        ...convite, status: "recusado"
                    }
                    : convite
            )
        );
    };

    const cancelarConvite = (conviteId) => {
        setConvites((convitesAtuais) =>
            convitesAtuais.map((convite) =>
                convite.id === conviteId
                    ? {
                        ...convite, status: "cancelado"
                    }
                    : convite
            )
        );
    };

    const buscarConvitesDoUsuario = (usuarioId) => {
        return convites.filter(
            (convite) =>
                String(convite.convidadoId) === String(usuarioId) && convite.status === "pendente"
        );
    };

    const buscarConvitesDaEquipe = (equipeId) => {
        return convites.filter(
            (convite) =>
                String(convite.equipeId) === String(equipeId) && convite.status === "pendente"
        );
    };

    return (
        <ConvitesContext.Provider
            value={{
                convites, enviarConvite, aceitarConvite, recusarConvite, 
                cancelarConvite, buscarConvitesDoUsuario, buscarConvitesDaEquipe
            }}
        >
            {children}
        </ConvitesContext.Provider>
    );
}

export function useConvites() {
    const context = useContext(ConvitesContext);

    if (!context) {
        throw new Error("useConvites deve ser usado dentro de um ConvitesProvider");
    }

    return context;
}