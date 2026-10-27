import { useState } from "react";
import { Box, Card, Chip, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import AvatarUsuario from "../AvatarUsuario/avatarUsuario";

function CardTarefa({ titulo, usuario, descricao, status, prioridade, dataLimite, origem, podeEditar = true, podeExcluir = true, aoEditar, aoExcluir }) {
    const [aberto, setAberto] = useState(null);
    const menuAberto = Boolean(aberto);
    const configuracaoStatus = {
        pendente: { label: "Pendente", cor: "warning" },
        andamento: { label: "Em andamento", cor: "info" },
        concluido: { label: "Concluído", cor: "success" }
    };

    const statusAtual = configuracaoStatus[status] || configuracaoStatus.pendente;

    const configuracaoPrioridade = {
        BAIXA: { label: "Baixa", cor: "success" },
        MEDIA: { label: "Média", cor: "warning" },
        ALTA: { label: "Alta", cor: "error" }
    };

    const prioridadeAtual = configuracaoPrioridade[prioridade];

    const abrirMenu = (event) => {
        setAberto(event.currentTarget);
    };

    const fecharMenu = () => {
        setAberto(null);
    };

    const obterInformacoesPrazo = () => {
        if (!dataLimite) {
            return null;
        }

        const [ano, mes, dia] = dataLimite.split("-").map(Number);
        const limite = new Date(ano, mes - 1, dia);
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);
        limite.setHours(0, 0, 0, 0);

        const diferencaMs = limite - hoje;
        const diferencaDias = Math.round(diferencaMs / (1000 * 60 * 60 * 24));
        const dataFormatada = limite.toLocaleDateString("pt-BR");

        if (status === "concluido") {
            return {
                texto: dataFormatada, cor: "text.secondary"
            };
        }

        if (diferencaDias < 0) {
            return {
                texto: `${dataFormatada} · Atrasada`, cor: "error.main"
            };
        }

        if (diferencaDias === 0) {
            return {
                texto: `${dataFormatada} · Hoje`, cor: "warning.main"
            };
        }

        if (diferencaDias <= 2) {
            return {
                texto: `${dataFormatada} · ${diferencaDias} ${diferencaDias === 1 ? "dia" : "dias"}`, cor: "warning.main"
            };
        }

        return {
            texto: dataFormatada, cor: "text.secondary"
        };
    };

    const prazo = obterInformacoesPrazo();

    return (
        <Card variant="outlined" sx={{ p: 2.2, minHeight: 160, position: "relative", bgcolor: (theme) => theme.palette.mode === "dark" ? "#1D2026" : "#FFFFFF", borderColor: "divider", transition: "transform 0.2s ease, box-shadow 0.2s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 18px rgba(0,0,0,0.07)" } }}>
            {(podeEditar || podeExcluir) && (
                <IconButton size="small" onClick={abrirMenu} sx={{ position: "absolute", top: 12, right: 12, color: "text.secondary" }}>
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            )}
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.35, pr: 5 }}>
                {titulo}
            </Typography>
            {origem && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4, fontWeight: 500 }}>
                    {origem}
                </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5, pr: 2 }}>
                {descricao}
            </Typography>
            {prioridadeAtual && (
                <Chip
                    label={prioridadeAtual.label} color={prioridadeAtual.cor} size="small" variant="outlined"
                    sx={{ mt: 1.5, height: 24, fontSize: "0.72rem", fontWeight: 600 }}
                />
            )}

            <Box sx={{ mt: 3, position: "relative", width: "100%", minHeight: 42 }}>
                <Box sx={{ position: "absolute", left: 0, bottom: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.72rem", mb: 0.5 }}>
                        Responsável
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.8} >
                        <AvatarUsuario usuario={usuario} tamanho="mini" comTooltip />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {usuario?.nome || "Sem responsável"}
                        </Typography>
                    </Stack>
                </Box>

                {prazo && (
                    <Box sx={{ position: "absolute", right: 0, bottom: 0, textAlign: "right" }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.72rem", mb: 0.5 }}>
                            Data limite
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                            <EventOutlinedIcon sx={{ fontSize: 15, color: prazo.cor }} />
                            <Typography variant="caption" sx={{ color: prazo.cor, fontWeight: prazo.cor === "text.secondary" ? 500 : 700, whiteSpace: "nowrap" }}>
                                {prazo.texto}
                            </Typography>
                        </Stack>
                    </Box>
                )}
            </Box>
            <Menu anchorEl={aberto} open={menuAberto} onClose={fecharMenu} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
                {podeEditar && (
                    <MenuItem
                        onClick={() => {
                            fecharMenu();
                            aoEditar?.();
                        }}
                    >
                        <EditOutlinedIcon fontSize="small" sx={{ mr: 1.2 }} />
                        Alterar
                    </MenuItem>
                )}
                {podeExcluir && (
                    <MenuItem sx={{ color: "error.main" }}
                        onClick={() => {
                            fecharMenu();
                            aoExcluir?.();
                        }}
                    >
                        <DeleteOutlineOutlinedIcon fontSize="small" sx={{ mr: 1.2 }} />
                        Excluir
                    </MenuItem>
                )}
            </Menu>
        </Card>
    );
}

export default CardTarefa;