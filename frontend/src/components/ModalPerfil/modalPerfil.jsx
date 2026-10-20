import { useEffect, useState } from "react";

import { Box, Button, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../../context/authContext";

function ModalPerfil({ aberto, aoFechar }) {
    const { usuarioLogado, atualizarPerfil } = useAuth();

    const [nome, setNome] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    const [erros, setErros] = useState({});
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        if (aberto && usuarioLogado) {
            setNome(usuarioLogado.nome || "");
            setNomeUsuario(usuarioLogado.nomeUsuario || "");
            setEmail(usuarioLogado.email || "");
            setTelefone(usuarioLogado.telefone || "");

            setErros({});
            setMensagemErro("");
        }
    }, [aberto, usuarioLogado]);

    const validarEmail = (valor) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (!nome.trim()) {
            novosErros.nome = "Informe seu nome";
        }

        if (!nomeUsuario.trim()) {
            novosErros.nomeUsuario = "Informe seu nome de usuário";
        } else if (nomeUsuario.trim().length < 3) {
            novosErros.nomeUsuario = "Use pelo menos 3 caracteres";
        } else if (!/^[a-zA-Z0-9_]+$/.test(nomeUsuario)) {
            novosErros.nomeUsuario = "Use apenas letras, números e _";
        }

        if (!email.trim()) {
            novosErros.email = "Informe seu e-mail";
        } else if (!validarEmail(email)) {
            novosErros.email = "Informe um e-mail válido";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const salvar = () => {
        if (!validarFormulario()) {
            return;
        }

        setMensagemErro("");
        const resultado = atualizarPerfil({ nome, nomeUsuario, email, telefone });

        if (!resultado.sucesso) {
            setMensagemErro(resultado.mensagem);
            return;
        }

        aoFechar();
    };

    return (
        <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none", border: "1px solid", borderColor: "divider" } }}>
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ position: "relative", mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", pr: 5 }}>
                        Meu perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Atualize suas informações pessoais
                    </Typography>
                    <IconButton onClick={aoFechar} size="small" sx={{ position: "absolute", top: -4, right: -4, color: "text.secondary" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Stack spacing={2.2}>
                    <TextField label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} error={Boolean(erros.nome)} helperText={erros.nome} fullWidth />
                    <TextField label="Nome de usuário" value={nomeUsuario} onChange={(event) => setNomeUsuario(event.target.value)} error={Boolean(erros.nomeUsuario)} helperText={erros.nomeUsuario} fullWidth />
                    <TextField label="Tag" value={usuarioLogado?.tag || ""} disabled fullWidth />
                    <TextField label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={Boolean(erros.email)} helperText={erros.email} fullWidth />
                    <TextField label="Telefone" value={telefone} onChange={(event) => setTelefone(event.target.value)} placeholder="(82) 99999-9999" fullWidth />
                </Stack>

                {mensagemErro && (
                    <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                        {mensagemErro}
                    </Typography>
                )}

                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
                    <Button variant="text" color="inherit" onClick={aoFechar} sx={{ color: "text.secondary" }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={salvar} sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 3, "&:hover": { bgcolor: "primary.dark" } }}>
                        Salvar
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPerfil;