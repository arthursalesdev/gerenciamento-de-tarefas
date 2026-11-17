import { createContext, useContext, useEffect, useState } from "react";
import { Alert, Box, Button, Snackbar } from "@mui/material";
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
    const [avisoSessaoAberto, setAvisoSessaoAberto] = useState(false);

    const [erroRecuperacao, setErroRecuperacao] = useState(false);
    const [tentativaRecuperacao, setTentativaRecuperacao] = useState(0);

    useEffect(() => {
        let ativo = true;

        async function recuperarSessao() {
            const token = localStorage.getItem(CHAVE_TOKEN);

            setVerificandoSessao(true);
            setErroRecuperacao(false);

            if (!token) {
                if (ativo) {
                    setVerificandoSessao(false);
                }

                return;
            }

            try {
                const resposta = await api.get("/auth/me");

                if (ativo && localStorage.getItem(CHAVE_TOKEN) === token) {
                    setUsuarioLogado(resposta.data);
                }
            } catch (erro) {
                if (!ativo || localStorage.getItem(CHAVE_TOKEN) !== token) {
                    return;
                }

                if (erro.response?.status === 401) {
                    localStorage.removeItem(CHAVE_TOKEN);
                    setUsuarioLogado(null);
                } else {
                    setErroRecuperacao(true);
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
    }, [tentativaRecuperacao]);

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
                buscarUsuarioPorIdentidade,
                buscarUsuarioPorId
            }}
        >
            {erroRecuperacao ? (
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        bgcolor: "background.default"
                    }}
                >
                    <Alert
                        severity="error"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setTentativaRecuperacao((atual) => atual + 1);
                                }}
                            >
                                Tentar novamente
                            </Button>
                        }
                    >
                        Não foi possível verificar sua sessão. Confira sua conexão e tente novamente.
                    </Alert>
                </Box>
            ) : (
                children
            )}

            <Snackbar
                open={avisoSessaoAberto}
                autoHideDuration={6000}
                onClose={() => setAvisoSessaoAberto(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="warning"
                    variant="filled"
                    onClose={() => setAvisoSessaoAberto(false)}
                    sx={{ width: "100%" }}
                >
                    Sua sessão expirou. Entre novamente para continuar.
                </Alert>
            </Snackbar>
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
