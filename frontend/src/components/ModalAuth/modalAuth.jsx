import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

    const [erros, setErros] = useState({});
    const [mensagemErro, setMensagemErro] = useState("");

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
    };

    const validarEmail = (valor) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (modo === "cadastro" && !nome.trim()) {
            novosErros.nome = "Informe seu nome";
        }

        if (!email.trim()) {
            novosErros.email = "Informe seu e-mail";
        } else if (!validarEmail(email)) {
            novosErros.email = "Informe um e-mail válido";
        }

        if (!senha) {
            novosErros.senha = "Informe sua senha";
        } else if (senha.length < 6) {
            novosErros.senha = "A senha deve ter pelo menos 6 caracteres";
        }

        if (modo === "cadastro") {
            if (!confirmarSenha) {
                novosErros.confirmarSenha = "Confirme sua senha";
            } else if (senha !== confirmarSenha) {
                novosErros.confirmarSenha = "As senhas não coincidem";
            }
        }

        if (modo === "cadastro") {
            if (!nomeUsuario.trim()) {
                novosErros.nomeUsuario = "Informe um nome de usuário";
            } else if (nomeUsuario.trim().length < 3) {
                novosErros.nomeUsuario = "Use pelo menos 3 caracteres";
            } else if (!/^[a-zA-Z0-9_]+$/.test(nomeUsuario)) {
                novosErros.nomeUsuario = "Use apenas letras, números e _";
            }
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const enviarFormulario = () => {
        if (!validarFormulario()) {
            return;
        }

        setMensagemErro("");

        if (modo === "login") {
            const resultado = login({ email, senha });

            if (!resultado.sucesso) {
                setMensagemErro(resultado.mensagem);
                return;
            }

            limparFormulario();
            aoFechar();
            navigate("/tarefas");
            return;
        }

        const resultado = cadastro({ nome, nomeUsuario, email, senha });

        if (!resultado.sucesso) {
            setMensagemErro(resultado.mensagem);
            return;
        }

        setModo("login");
        setNome("");
        setSenha("");
        setConfirmarSenha("");
        setErros({});
        setMensagemErro("");
    };

    const trocarModo = () => {
        setModo((modoAtual) => modoAtual === "login" ? "cadastro" : "login");
        setErros({});
        setMensagemErro("");
        setSenha("");
        setConfirmarSenha("");
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
                        <TextField 
                            label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} 
                            error={Boolean(erros.nome)} helperText={erros.nome} fullWidth autoFocus 
                        />
                    )}

                    <TextField 
                        label="Nome de usuário" value={nomeUsuario} onChange={(event) => setNomeUsuario(event.target.value)} 
                        error={Boolean(erros.nomeUsuario)} helperText={ erros.nomeUsuario || "Sua tag será gerada automaticamente" } fullWidth 
                    />

                    <TextField
                        label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)}
                        error={Boolean(erros.email)} helperText={erros.email} fullWidth autoFocus={modo === "login"}
                    />

                    <TextField
                        label="Senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)}
                        error={Boolean(erros.senha)} helperText={erros.senha} fullWidth
                    />

                    {modo === "cadastro" && (
                        <TextField
                            label="Confirmar senha" type="password" value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)}
                            error={Boolean(erros.confirmarSenha)} helperText={erros.confirmarSenha} fullWidth
                        />
                    )}
                </Stack>

                {mensagemErro && (
                    <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                        {mensagemErro}
                    </Typography>
                )}

                <Button variant="contained" fullWidth onClick={enviarFormulario} sx={{ mt: 3, py: 1.15, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } }}>
                    {modo === "login" ? "Entrar" : "Criar conta"}
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