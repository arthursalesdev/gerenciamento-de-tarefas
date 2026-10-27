import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./authContext";
import { useMembros } from "./membrosContext";
import { useEquipes } from "./equipesContext";

const ConvitesContext = createContext();
const CHAVE_CONVITES = "convitesEquipes";

export function ConvitesProvider({ children }) {
    const { recarregarMembros } = useMembros();
    const { recarregarEquipes } = useEquipes();
    const { usuarioLogado } = useAuth();

    const [convitesApi, setConvitesApi] = useState([]);
    const [carregandoConvites, setCarregandoConvites] = useState(false);
    const [erroConvites, setErroConvites] = useState("");

    const [convites, setConvites] = useState(() => {
        const convitesSalvos = localStorage.getItem(CHAVE_CONVITES);
        return convitesSalvos ? JSON.parse(convitesSalvos) : [];
    });

    useEffect(() => {
        if (!usuarioLogado?.id) {
            setConvitesApi([]);
            setErroConvites("");
            return;
        }

        let ativo = true;

        const carregarConvites = async () => {
            setCarregandoConvites(true);
            setErroConvites("");

            try {
                const resposta = await api.get("/convites-equipes/recebidos");

                if (ativo) {
                    setConvitesApi(resposta.data.filter((convite) => convite.status === "PENDENTE"));
                }
            } catch (error) {
                if (ativo) {
                    setErroConvites(error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível carregar os convites");
                }
            } finally {
                if (ativo) setCarregandoConvites(false);
            }
        };

        carregarConvites();

        return () => {
            ativo = false;
        };
    }, [usuarioLogado?.id]);

    const enviarConvite = async ({ equipeId, convidadoId, convidadorId, cargoId = "membro" }) => {
        try {
            const resposta = await api.post("/convites-equipes", { equipeId: Number(equipeId), convidadoId: Number(convidadoId), cargo: cargoId.toUpperCase() });

            return {
                sucesso: true, convite: resposta.data
            };
        } catch (error) {
            return {
                sucesso: false, mensagem: error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível enviar o convite"
            };
        }
    };

    const aceitarConvite = async (conviteId) => {
        const resposta = await api.patch( `/convites-equipes/${conviteId}/aceitar`);

        setConvitesApi((atuais) => atuais.filter((convite) => String(convite.id) !== String(conviteId)));

        try {
            const equipesAtualizadas = await recarregarEquipes();
            await recarregarMembros(equipesAtualizadas);
        } catch (error) {
            console.error("Convite aceito, mas houve erro ao atualizar equipes e membros:", error);
        }

        return resposta.data;
    };

    const recusarConvite = async (conviteId) => {
        const resposta = await api.patch(`/convites-equipes/${conviteId}/recusar`);

        setConvitesApi((atuais) => atuais.filter((convite) => String(convite.id) !== String(conviteId)));

        return resposta.data;
    };

    const cancelarConvite = async (conviteId) => {
        const resposta = await api.patch(`/convites-equipes/${conviteId}/cancelar`);

        setConvitesApi((atuais) => atuais.filter((convite) => String(convite.id) !== String(conviteId)));

        return resposta.data;
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
        <ConvitesContext.Provider value={{ convites, convitesApi, carregandoConvites, erroConvites, enviarConvite, aceitarConvite, recusarConvite, cancelarConvite, buscarConvitesDoUsuario, buscarConvitesDaEquipe }}>
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