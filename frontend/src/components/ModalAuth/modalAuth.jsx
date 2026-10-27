import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Dialog, DialogContent, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useAuth } from "../../context/authContext";

function ModalAuth({ aberto, aoFechar, modoInicial = "login" }) {
    const navigate = useNavigate();

    const { login, cadastro } = useAuth();

    const [modo, setModo] = useState(modoInicial);

    const [nome, setNome] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const [erros, setErros] = useState({});
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (aberto) {
            setModo(modoInicial);
            limparFormulario();
        }
    }, [aberto, modoInicial]);

    const limparFormulario = () => {
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setErros({});
        setMensagemErro("");
        setNomeUsuario("");
        setMostrarSenha(false);
        setMostrarConfirmarSenha(false);
    };

    const validarEmail = (valor) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (modo === "cadastro") {
            if (!nome.trim()) {
                novosErros.nome = "Informe seu nome";
            }

            const usuarioNormalizado = nomeUsuario.trim().toLowerCase();

            if (!usuarioNormalizado) {
                novosErros.nomeUsuario = "Informe um nome de usuário";
            } else if (!/^[a-z0-9_]{3,50}$/.test(usuarioNormalizado)) {
                novosErros.nomeUsuario = "Use de 3 a 50 caracteres: letras, números ou _";
            }

            if (!email.trim()) {
                novosErros.email = "Informe seu e-mail";
            } else if (!validarEmail(email)) {
                novosErros.email = "Informe um e-mail válido";
            }
        } else {
            if (!email.trim()) {
                novosErros.email = "Informe seu e-mail ou nome de usuário";
            }
        }

        if (!senha) {
            novosErros.senha = "Informe sua senha";
        } else if (modo === "cadastro" && senha.length < 6) {
            novosErros.senha = "A senha deve ter pelo menos 6 caracteres";
        }

        if (modo === "cadastro") {
            if (!confirmarSenha) {
                novosErros.confirmarSenha = "Confirme sua senha";
            } else if (senha !== confirmarSenha) {
                novosErros.confirmarSenha = "As senhas não coincidem";
            }
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const enviarFormulario = async () => {
        if (carregando) {
            return;
        }

        if (!validarFormulario()) {
            return;
        }

        setMensagemErro("");
        setCarregando(true);

        try {
            if (modo === "login") {
                const resultado = await login({
                    identificador: email.trim(),
                    senha
                });

                if (!resultado.sucesso) {
                    setMensagemErro(resultado.mensagem);
                    return;
                }

                limparFormulario();
                aoFechar();
                navigate("/tarefas");
                return;
            }

            const resultado = await cadastro({
                nome: nome.trim(),
                nomeUsuario: nomeUsuario.trim().toLowerCase(),
                email: email.trim().toLowerCase(),
                senha
            });

            if (!resultado.sucesso) {
                setMensagemErro(resultado.mensagem);
                return;
            }

            setModo("login");
            setNome("");
            setNomeUsuario("");
            setSenha("");
            setConfirmarSenha("");
            setErros({});
            setMensagemErro("");
        } catch (erro) {
            console.error("Erro inesperado na autenticação:", erro);
            setMensagemErro("Ocorreu um erro inesperado. Tente novamente");
        } finally {
            setCarregando(false);
        }
    };

    const trocarModo = () => {
        setModo((modoAtual) => modoAtual === "login" ? "cadastro" : "login");
        setErros({});
        setMensagemErro("");
        setSenha("");
        setConfirmarSenha("");
        setMostrarSenha(false);
        setMostrarConfirmarSenha(false);
    };

    const fechar = () => {
        limparFormulario();
        aoFechar();
    };

    return (
        <Dialog open={aberto} onClose={fechar} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none", border: "1px solid", borderColor: "divider" } }}>
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ position: "relative", mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", pr: 5 }}>
                        {modo === "login" ? "Entrar" : "Criar conta"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {modo === "login" ? "Acesse sua conta para continuar" : "Crie sua conta para começar"}
                    </Typography>
                    <IconButton onClick={fechar} size="small" sx={{ position: "absolute", top: -4, right: -4, color: "text.secondary" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Stack spacing={2.2}>
                    {modo === "cadastro" && (
                        <>
                            <TextField
                                label="Nome" value={nome} onChange={(event) => setNome(event.target.value)}
                                error={Boolean(erros.nome)} helperText={erros.nome} fullWidth autoFocus disabled={carregando}
                            />

                            <TextField
                                label="Nome de usuário" value={nomeUsuario} onChange={(event) => setNomeUsuario(event.target.value)}
                                error={Boolean(erros.nomeUsuario)} fullWidth disabled={carregando}
                                helperText={
                                    erros.nomeUsuario || "De 3 a 50 caracteres, utilizando letras, números ou _"
                                }
                            />
                        </>
                    )}

                    <TextField
                        label={modo === "login" ? "E-mail ou nome de usuário" : "E-mail"} type={modo === "login" ? "text" : "email"} value={email} onChange={(event) => setEmail(event.target.value)}
                        error={Boolean(erros.email)} helperText={erros.email} fullWidth autoFocus={modo === "login"} disabled={carregando}
                    />

                    <TextField
                        label="Senha" type={mostrarSenha ? "text" : "password"} value={senha} onChange={(event) => setSenha(event.target.value)}
                        error={Boolean(erros.senha)} helperText={erros.senha} fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} onClick={() => setMostrarSenha((valor) => !valor)} edge="end">
                                            {mostrarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    {modo === "cadastro" && (
                        <TextField
                            label="Confirmar senha" type={mostrarConfirmarSenha ? "text" : "password"} value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)}
                            error={Boolean(erros.confirmarSenha)} helperText={erros.confirmarSenha} fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={mostrarConfirmarSenha ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                                                onClick={() => setMostrarConfirmarSenha((valor) => !valor)} edge="end"
                                            >
                                                {mostrarConfirmarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    )}
                </Stack>

                {mensagemErro && (
                    <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                        {mensagemErro}
                    </Typography>
                )}

                <Button variant="contained" fullWidth onClick={enviarFormulario} disabled={carregando}
                    sx={{
                        mt: 3, py: 1.15, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" }
                    }}
                >
                    {carregando ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
                </Button>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mt: 2.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        {modo === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
                    </Typography>

                    <Button variant="text" onClick={trocarModo} sx={{ minWidth: "auto", p: 0, color: "primary.main", fontWeight: 600 }}>
                        {modo === "login" ? "Cadastrar" : "Entrar"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalAuth;