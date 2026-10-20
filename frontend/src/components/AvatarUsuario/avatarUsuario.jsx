import { Avatar, Box, Tooltip } from "@mui/material";
import { Blobatar } from "@blobatar/react";

import "blobatar/motion.css";

const TAMANHOS_AVATAR = { mini: 24, pequeno: 28, medio: 36, grande: 64 };

function AvatarUsuario({ usuario, tamanho = "medio", animado = false, comTooltip = false, sx = {} }) {
    const tamanhoAvatar = TAMANHOS_AVATAR[tamanho] ?? TAMANHOS_AVATAR.medio;
    const usuarioValido = usuario && usuario.id !== undefined && usuario.id !== null;

    if (!usuarioValido) {
        return (
            <Avatar sx={{ width: tamanhoAvatar, height: tamanhoAvatar, fontSize: tamanhoAvatar * 0.45, bgcolor: "action.selected", color: "text.secondary", flexShrink: 0, ...sx }}>
                ?
            </Avatar>
        );
    }

    const seed = `usuario-${usuario.id}`;

    const avatar = (
        <Box
            sx={{
                width: tamanhoAvatar, height: tamanhoAvatar, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                lineHeight: 0, "& img, & svg": { display: "block", width: "100%", height: "100%" }, ...sx
            }}
        >
            <Blobatar name={seed} size={tamanhoAvatar} {...(animado ? { animate: "hover" } : {})} />
        </Box>
    );

    if (!comTooltip) {
        return avatar;
    }

    const nome = usuario.nome || usuario.nomeUsuario || "Usuário";
    const identificacao = usuario.nomeUsuario ? `@${usuario.nomeUsuario}${usuario.tag ? ` ${usuario.tag}` : ""}` : null;
    const tituloTooltip = identificacao ? `${nome} · ${identificacao}` : nome;

    return (
        <Tooltip title={tituloTooltip} arrow placement="top">
            {avatar}
        </Tooltip>
    );
}

export default AvatarUsuario;