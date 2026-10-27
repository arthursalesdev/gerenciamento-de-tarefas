import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./authContext";
import api from "../services/api";

const EquipesContext = createContext();
const CHAVE_EQUIPES = "equipes";
const equipesIniciais = [];

export function EquipesProvider({ children }) {
    const { usuarioLogado } = useAuth();
    const usuarioAtualRef = useRef(usuarioLogado?.id);
    const requisicaoEquipesRef = useRef(0);

    usuarioAtualRef.current = usuarioLogado?.id;

    const [equipesApi, setEquipesApi] = useState([]);
    const [carregandoEquipes, setCarregandoEquipes] = useState(false);
    const [erroEquipes, setErroEquipes] = useState("");

    const [equipes, setEquipes] = useState(() => {
        const equipesSalvas = localStorage.getItem(CHAVE_EQUIPES);
        return equipesSalvas ? JSON.parse(equipesSalvas) : equipesIniciais;
    });

    useEffect(() => {
        localStorage.setItem(CHAVE_EQUIPES, JSON.stringify(equipes));
    }, [equipes]);

    const recarregarEquipes = useCallback(async () => {
        const usuarioDaConsulta = usuarioLogado?.id;
        const requisicao = ++requisicaoEquipesRef.current;

        if (!usuarioDaConsulta) {
            setEquipesApi([]);
            return [];
        }

        const consultaAtual = () => requisicao === requisicaoEquipesRef.current && String(usuarioAtualRef.current) === String(usuarioDaConsulta);

        setCarregandoEquipes(true);
        setErroEquipes("");

        try {
            const resposta = await api.get("/equipes");
            const dados = resposta.data;
            const lista = Array.isArray(dados)
                ? dados
                : Array.isArray(dados?.equipes)
                    ? dados.equipes : [];

            if (consultaAtual()) {
                setEquipesApi(lista);
            }

            return consultaAtual() ? lista : [];
        } catch (error) {
            if (consultaAtual()) {
                setErroEquipes(error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível carregar as equipes");
                throw error;
            }

            return [];
        } finally {
            if (consultaAtual()) {
                setCarregandoEquipes(false);
            }
        }
    }, [usuarioLogado?.id]);

    useEffect(() => {
        if (!usuarioLogado?.id) {
            setEquipesApi([]);
            setErroEquipes("");
            requisicaoEquipesRef.current += 1;
            setCarregandoEquipes(false);
            return;
        }

        recarregarEquipes().catch(() => { });
    }, [usuarioLogado?.id, recarregarEquipes]);

    const buscarEquipePorId = (id) => {
        return equipesVisiveis.find((equipe) => String(equipe.id) === String(id));
    };

    const criarEquipe = async (nome) => {
        if (!usuarioLogado) {
            throw new Error("É necessário estar autenticado.");
        }

        const resposta = await api.post("/equipes", {
            nome: nome.trim()
        });

        const novaEquipe = resposta.data;

        setEquipesApi((atuais) => [...atuais, novaEquipe]);
        setEquipes((atuais) => [
            ...atuais,
            {
                ...novaEquipe,
                donoId: usuarioLogado.id
            }
        ]);

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

    const equipesVisiveis = usuarioLogado?.id ? equipesApi : [];

    return (
        <EquipesContext.Provider value={{ equipes: equipesVisiveis, equipesApi, recarregarEquipes, carregandoEquipes, erroEquipes, buscarEquipePorId, criarEquipe, transferirDono }}>            {children}
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