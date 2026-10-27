import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();
const CHAVE_TOKEN = "taskflow_token";

function obterMensagemErro(erro, mensagemPadrao) {
    if (!erro.response) {
        return "Não foi possível conectar ao servidor";
    }

    return (erro.response.data?.mensagem || erro.response.data?.message || mensagemPadrao);
}

export function AuthProvider({ children }) {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [verificandoSessao, setVerificandoSessao] = useState(true);

    useEffect(() => {
        let ativo = true;

        async function recuperarSessao() {
            const token = localStorage.getItem(CHAVE_TOKEN);

            if (!token) {
                if (ativo) setVerificandoSessao(false);
                return;
            }

            try {
                const resposta = await api.get("/auth/me");

                if (ativo) {
                    setUsuarioLogado(resposta.data);
                }
            } catch (erro) {
                if (erro.response?.status === 401 || erro.response?.status === 403) {
                    localStorage.removeItem(CHAVE_TOKEN);
                }

                if (ativo) {
                    setUsuarioLogado(null);
                }
            } finally {
                if (ativo) {
                    setVerificandoSessao(false);
                }
            }
        }

        recuperarSessao();

        return () => {
            ativo = false;
        };
    }, []);

    const cadastro = async ({ nome, nomeUsuario, email, senha }) => {
        try {
            const resposta = await api.post("/auth/cadastro", {
                nome, nomeUsuario, email, senha
            });

            return {
                sucesso: true, mensagem: "Conta criada com sucesso", usuario: resposta.data
            };
        } catch (erro) {
            return {
                sucesso: false, mensagem: obterMensagemErro(erro, "Não foi possível criar sua conta")
            };
        }
    };

    const login = async ({ identificador, email, senha }) => {
        try {
            const resposta = await api.post("/auth/login", {
                identificador: identificador ?? email,
                senha
            });

            const { token, usuario } = resposta.data;

            if (!token || !usuario) {
                return {
                    sucesso: false, mensagem: "Resposta de autenticação inválida"
                };
            }

            localStorage.setItem(CHAVE_TOKEN, token);
            setUsuarioLogado(usuario);

            return {
                sucesso: true, mensagem: "Login realizado com sucesso", usuario
            };
        } catch (erro) {
            return {
                sucesso: false, mensagem: obterMensagemErro(erro, "Não foi possível realizar o login")
            };
        }
    };

    const logout = () => {
        localStorage.removeItem(CHAVE_TOKEN);
        setUsuarioLogado(null);
    };

    const atualizarPerfil = () => {
        return {
            sucesso: false,
            mensagem: "A edição de perfil ainda não está disponível"
        };
    };

    const buscarUsuarioPorIdentidade = async (nomeUsuario, tag) => {
        const nome = nomeUsuario?.trim();
        const tagFormatada = tag?.trim().replace(/^#/, "");

        if (!nome || !/^\d{4}$/.test(tagFormatada)) {
            return null;
        }

        try {
            const resposta = await api.get("/usuarios/buscar", {
                params: {
                    nomeUsuario: nome,
                    tag: tagFormatada
                }
            });

            return resposta.data;
        } catch (erro) {
            if (erro.response?.status === 404) {
                return null;
            }

            throw erro;
        }
    };

    const buscarUsuarioPorId = async (usuarioId) => {
        if (!usuarioId) {
            return null;
        }

        try {
            const resposta = await api.get(`/usuarios/${usuarioId}`);
            return resposta.data;
        } catch (erro) {
            if (erro.response?.status === 404) {
                return null;
            }

            throw erro;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                usuarioLogado,
                usuarios: [],
                estaLogado: Boolean(usuarioLogado),
                verificandoSessao,
                login,
                cadastro,
                logout,
                atualizarPerfil,
                buscarUsuarioPorIdentidade,
                buscarUsuarioPorId
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
}
