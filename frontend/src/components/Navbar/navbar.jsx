import { AppBar, Toolbar, Stack, Button, Box, Typography, Divider, Menu, MenuItem, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import ThemeToggle from "../../components/ThemeToggle";
import SeletorArea from "../SeletorArea/seletorArea";
import ModalAuth from "../ModalAuth/modalAuth";
import ModalConvites from "../ModalConvites/modalConvites";
import ModalPerfil from "../ModalPerfil/modalPerfil";
import AvatarUsuario from "../AvatarUsuario/avatarUsuario";

import { useAuth } from "../../context/authContext";
import { useArea } from "../../context/areaContext";
import { usePermissoes } from "../../context/permissoesContext";
import { useConvites } from "../../context/convitesContext";

import logo02 from "../../assets/taskflow-navbar-cinza-escuro.png";


export const Navbar = () => {
    const navigate = useNavigate();

    const [modalAuthAberto, setModalAuthAberto] = useState(false);
    const [modalPerfilAberto, setModalPerfilAberto] = useState(false);

    const { usuarioLogado, estaLogado, logout } = useAuth();
    const { irParaPessoal } = useArea();
    const { pode } = usePermissoes();
    const { buscarConvitesDoUsuario } = useConvites();

    const [menuUsuario, setMenuUsuario] = useState(null);
    const [modalConvitesAberto, setModalConvitesAberto] = useState(false);

    const menuUsuarioAberto = Boolean(menuUsuario);

    const abrirPerfil = () => {
        fecharMenuUsuario();
        setModalPerfilAberto(true);
    };

    const abrirMenuUsuario = (event) => {
        setMenuUsuario(event.currentTarget);
    };

    const fecharMenuUsuario = () => {
        setMenuUsuario(null);
    };

    const convitesPendentes = usuarioLogado ? buscarConvitesDoUsuario(usuarioLogado.id) : [];

    const abrirConvites = () => {
        fecharMenuUsuario();
        setModalConvitesAberto(true);
    };

    const sair = () => {
        fecharMenuUsuario();
        irParaPessoal();
        logout();
        navigate("/");
    };

    const irParaInicio = () => {
        navigate("/");
    };

    const irParaTarefas = () => {
        navigate("/tarefas");
    };

    const irParaGerenciamento = () => {
        navigate("/gerenciamento");
    };

    const irParaPainel = () => {
        navigate("/painel");
    };

    return (
        <>
            <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "#25272D", backgroundImage: "none", color: "#F1F1EF", borderBottom: "1px solid #34373E" }}>
                <Toolbar sx={{ justifyContent: "center", minHeight: { xs: "80px", md: "80px" }, position: "relative" }}>
                    <Box component="img" src={logo02} sx={{ height: "60px", width: "auto", marginRight: 2, display: { xs: "none", md: "block" }, position: "absolute", left: "15px" }} />
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", mb: 0 }}>
                        <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <ThemeToggle />
                        </Stack>
                        <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                        {estaLogado ? (
                            <Button variant="text" startIcon={<LogoutIcon sx={{ color: "primary.main" }} />} onClick={sair} sx={{ color: "#F1F1EF", px: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.07)" } }}>
                                Sair
                            </Button>
                        ) : (
                            <Button variant="text" startIcon={<LoginIcon sx={{ color: "primary.main" }} />} onClick={() => setModalAuthAberto(true)} sx={{ color: "#F1F1EF", px: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.07)" } }}>
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>

                {estaLogado && (
                    <Toolbar sx={{ minHeight: { xs: "20px", md: "30px" }, backgroundColor: "#34373E", color: "#F1F1EF" }}>
                        <Button variant="text" onClick={irParaInicio} sx={{ minWidth: "auto", p: 0, color: "#FFFFFF" }}>
                            <HomeIcon sx={{ fontSize: 17, color: "primary.main" }} />
                        </Button>
                        <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                        <SeletorArea />
                        <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                        <Button variant="text" startIcon={<ListAltIcon sx={{ color: "primary.main" }} />} onClick={irParaTarefas} sx={{ backgroundColor: "transparent", color: "white", fontSize: 13 }}>
                            TAREFAS
                        </Button>
                        <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                        <Button variant="text" startIcon={<AnalyticsOutlinedIcon sx={{ color: "primary.main" }} />} onClick={irParaPainel} sx={{ backgroundColor: "transparent", color: "white", fontSize: 13 }}>
                            PAINEL
                        </Button>
                        <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                        {pode("gerenciarMembros") && (
                            <>
                                <Button variant="text" startIcon={<SettingsOutlinedIcon sx={{ color: "primary.main" }} />} onClick={irParaGerenciamento} sx={{ backgroundColor: "transparent", color: "white", fontSize: 13 }}>
                                    GERENCIAMENTO
                                </Button>
                                <Divider orientation="vertical" sx={{ height: 20, alignSelf: "center", mx: 1.5, borderColor: "rgba(255,255,255,0.35)" }} />
                            </>
                        )}

                        <Box sx={{ ml: "auto" }}>
                            <Button variant="text" onClick={abrirMenuUsuario} endIcon={<KeyboardArrowDownIcon sx={{ color: "primary.main" }} />}
                                sx={{
                                    color: "#F1F1EF", textTransform: "none", px: 1.5, py: 0.5, borderRadius: 0.8, "&:hover": { bgcolor: "rgba(255,255,255,0.07)" }
                                }}
                            >
                                <AvatarUsuario usuario={usuarioLogado} tamanho="pequeno" animado />
                                <Box sx={{ textAlign: "left" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>{usuarioLogado?.nomeUsuario}</strong>{" "}
                                        <Box component="span" sx={{ color: "primary.main" }}>
                                            {usuarioLogado?.tag}
                                        </Box>
                                    </Typography>
                                </Box>
                            </Button>
                        </Box>
                    </Toolbar>
                )}
                <Menu anchorEl={menuUsuario} open={menuUsuarioAberto} onClose={fecharMenuUsuario} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{ paper: { sx: { mt: 1, minWidth: 240, borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none", border: "1px solid", borderColor: "divider" } } }}
                >

                    <MenuItem onClick={abrirPerfil}>
                        <PersonOutlineOutlinedIcon sx={{ mr: 1.5, fontSize: 19, color: "primary.main" }} />
                        <Typography variant="body2">
                            Meu perfil
                        </Typography>
                    </MenuItem>

                    <MenuItem onClick={abrirConvites}>
                        <MailOutlineOutlinedIcon sx={{ mr: 1.5, fontSize: 19, color: "primary.main" }} />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                            Convites
                        </Typography>
                        {convitesPendentes.length > 0 && (
                            <Badge badgeContent={convitesPendentes.length} color="error" sx={{ mr: 1 }} />
                        )}
                    </MenuItem>

                    <MenuItem onClick={fecharMenuUsuario}>
                        <SettingsOutlinedIcon sx={{ mr: 1.5, fontSize: 19, color: "primary.main" }} />
                        <Typography variant="body2">
                            Configurações
                        </Typography>
                    </MenuItem>
                </Menu>
            </AppBar>
            <ModalAuth aberto={modalAuthAberto} aoFechar={() => setModalAuthAberto(false)} />
            <ModalConvites aberto={modalConvitesAberto} aoFechar={() => setModalConvitesAberto(false)} />
            <ModalPerfil aberto={modalPerfilAberto} aoFechar={() => setModalPerfilAberto(false)} />
        </>
    );
};

export default Navbar;