import { useEffect, useState } from "react";

import { Alert, Box, Button, Dialog, DialogContent, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
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
    const [responsavelId, setResponsavelId] = useState("sem-responsavel");

    const [erros, setErros] = useState({});
    const [prioridade, setPrioridade] = useState("MEDIA");
    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState("");

    useEffect(() => {
        if (modo === "editar" && tarefaSelecionada) {
            setTitulo(tarefaSelecionada.titulo || "");
            setDescricao(tarefaSelecionada.descricao || "");
            setStatus(tarefaSelecionada.status || "pendente");
            setPrioridade(tarefaSelecionada.prioridade || "MEDIA");
            setDataLimite(tarefaSelecionada.dataLimite || "");
            setResponsavelId(
                tarefaSelecionada.responsavelId ??
                (tarefaSelecionada.origemPersistencia === "local" ? tarefaSelecionada.usuarioId : null) ??
                "sem-responsavel"
            );
        } else {
            setTitulo("");
            setDescricao("");
            setStatus("pendente");
            setPrioridade("MEDIA");
            setDataLimite("");
            setResponsavelId("sem-responsavel");
        }
        setErros({});
        setErroSalvar("");
    }, [modo, tarefaSelecionada, aberto, areaPessoal]);

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

    const salvar = async () => {
        if (salvando || !validarFormulario()) {
            return;
        }

        setSalvando(true);
        setErroSalvar("");

        try {
            const dados = {
                titulo, descricao, status, prioridade, dataLimite
            };

            if (!areaPessoal && podeAlterarResponsavel) {
                dados.responsavelId =
                    responsavelId === "sem-responsavel" || responsavelId === ""
                        ? null : Number(responsavelId);
            }

            await aoSalvar(dados);
            aoFechar();
        } catch (error) {
            setErroSalvar(error.response?.data?.message || error.response?.data?.mensagem || error.message || "Não foi possível salvar a tarefa");
        } finally {
            setSalvando(false);
        }
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
                    {erroSalvar && (
                        <Alert severity="error">
                            {erroSalvar}
                        </Alert>
                    )}
                    <TextField label="Título" value={titulo} onChange={(event) => setTitulo(event.target.value)} error={Boolean(erros.titulo)} helperText={erros.titulo} fullWidth autoFocus disabled={modo === "editar" && !podeEditar} />
                    <TextField label="Descrição" value={descricao} onChange={(event) => setDescricao(event.target.value)} fullWidth multiline rows={3} disabled={modo === "editar" && !podeEditar} />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {!areaPessoal && (
                            <TextField select label="Responsável" value={responsavelId} onChange={(event) => setResponsavelId(event.target.value)} fullWidth disabled={salvando || !podeAlterarResponsavel}>
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

                    <TextField select label="Prioridade" value={prioridade} onChange={(event) => setPrioridade(event.target.value)} fullWidth disabled={salvando || (modo === "editar" && !podeEditar)}>
                        <MenuItem value="BAIXA">Baixa</MenuItem>
                        <MenuItem value="MEDIA">Média</MenuItem>
                        <MenuItem value="ALTA">Alta</MenuItem>
                    </TextField>

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
                    <Button variant="contained" onClick={salvar} disabled={salvando} sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 3, "&:hover": { bgcolor: "primary.dark" } }}>
                        {salvando ? "Salvando..." : modo === "editar" ? "Atualizar" : "Salvar"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalTarefa;