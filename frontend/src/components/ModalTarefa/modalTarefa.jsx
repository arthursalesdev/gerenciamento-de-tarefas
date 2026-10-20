import { useEffect, useState } from "react";

import { Box, Button, Dialog, DialogContent, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AvatarUsuario from "../AvatarUsuario/avatarUsuario";

function ModalTarefa({
    aberto, aoFechar, aoSalvar, modo = "criar", tarefaSelecionada = null,
    responsaveis = [], areaPessoal = false, podeEditar = true,
    podeAlterarStatus = true, podeAlterarResponsavel = true, podeAlterarData = true
}) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [status, setStatus] = useState("pendente");
    const [dataLimite, setDataLimite] = useState("");
    const [usuarioId, setUsuarioId] = useState("");

    const [erros, setErros] = useState({});

    useEffect(() => {
        if (modo === "editar" && tarefaSelecionada) {
            setTitulo(tarefaSelecionada.titulo || "");
            setDescricao(tarefaSelecionada.descricao || "");
            setStatus(tarefaSelecionada.status || "pendente");
            setDataLimite(tarefaSelecionada.dataLimite || "");
            setUsuarioId(tarefaSelecionada.usuarioId || "sem-responsavel");
        } else {
            setTitulo("");
            setDescricao("");
            setStatus("pendente");
            setDataLimite("");
            setUsuarioId(areaPessoal && responsaveis.length > 0 ? responsaveis[0].id : "");
        }
        setErros({});
    }, [modo, tarefaSelecionada, aberto, areaPessoal, responsaveis]);

    const validarFormulario = () => {
        const novosErros = {};

        if (!titulo.trim()) {
            novosErros.titulo = "Informe o título";
        }

        if (!dataLimite) {
            novosErros.dataLimite = "Informe a data limite";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const salvar = () => {
        if (!validarFormulario()) {
            return;
        }

        aoSalvar({ titulo, descricao, status, dataLimite, usuarioId: usuarioId === "sem-responsavel" ? "" : usuarioId });
        aoFechar();
    };

    const cancelar = () => {
        setErros({});
        aoFechar();
    };

    return (
        <Dialog open={aberto} onClose={cancelar} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none" } }}>
            <DialogContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ position: "relative", mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ pr: 5 }}>
                        {modo === "editar" ? "Editar tarefa" : "Nova tarefa"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {modo === "editar" ? "Atualize as informações da tarefa." : "Crie uma nova tarefa para o quadro."}
                    </Typography>
                    <IconButton onClick={cancelar} size="small" sx={{ position: "absolute", top: -4, right: -4, color: "text.secondary" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Stack spacing={2.5}>
                    <TextField label="Título" value={titulo} onChange={(event) => setTitulo(event.target.value)} error={Boolean(erros.titulo)} helperText={erros.titulo} fullWidth autoFocus disabled={modo === "editar" && !podeEditar} />
                    <TextField label="Descrição" value={descricao} onChange={(event) => setDescricao(event.target.value)} fullWidth multiline rows={3} disabled={modo === "editar" && !podeEditar} />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {!areaPessoal && (
                            <TextField select label="Responsável" value={usuarioId} onChange={(event) => setUsuarioId(event.target.value)} error={Boolean(erros.usuarioId)} helperText={erros.usuarioId} fullWidth disabled={modo === "editar" && !podeAlterarResponsavel}>
                                <MenuItem value="sem-responsavel">
                                    Sem responsável
                                </MenuItem>
                                {responsaveis.map((usuario) => (
                                    <MenuItem key={usuario.id} value={usuario.id} sx={{ gap: 1.2, py: 1 }}>
                                        <AvatarUsuario usuario={usuario} tamanho="pequeno" />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} >
                                                {usuario.nome}
                                            </Typography>
                                            {usuario.nomeUsuario && (
                                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }} >
                                                    @{usuario.nomeUsuario}
                                                    {usuario.tag && (
                                                        <Box component="span" sx={{ color: "primary.main", ml: 0.5 }}>
                                                            {usuario.tag}
                                                        </Box>
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField select label="Status" value={status} onChange={(event) => setStatus(event.target.value)} fullWidth disabled={modo === "editar" && !podeAlterarStatus}>
                            <MenuItem value="pendente">
                                Pendente
                            </MenuItem>
                            <MenuItem value="andamento">
                                Em andamento
                            </MenuItem>
                            <MenuItem value="concluido">
                                Concluído
                            </MenuItem>
                        </TextField>
                    </Stack>

                    <TextField
                        label="Data limite" type="date" value={dataLimite} onChange={(event) => setDataLimite(event.target.value)}
                        error={Boolean(erros.dataLimite)} helperText={erros.dataLimite} fullWidth disabled={modo === "editar" && !podeAlterarData}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1.5} sx={{ mt: 3 }}>
                    <Button variant="text" color="inherit" onClick={cancelar} sx={{ color: "text.secondary" }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={salvar} sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 3, "&:hover": { bgcolor: "primary.dark" } }}>
                        {modo === "editar" ? "Atualizar" : "Salvar"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalTarefa;