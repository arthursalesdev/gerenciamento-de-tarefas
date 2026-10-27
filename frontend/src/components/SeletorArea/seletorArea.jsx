import { useState } from "react";
import { Alert, Box, Button, Divider, Menu, MenuItem, Snackbar, Typography } from "@mui/material";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import ModalEquipe from "../ModalEquipe/modalEquipe";
import { useArea } from "../../context/areaContext";
import { useEquipes } from "../../context/equipesContext";
import { useAuth } from "../../context/authContext";
import { useMembros } from "../../context/membrosContext";
import { useCargos } from "../../context/cargosContext";

function SeletorArea() {
    const [aberto, setAberto] = useState(null);
    const [modalEquipeAberto, setModalEquipeAberto] = useState(false);
    const [saindoDaEquipe, setSaindoDaEquipe] = useState(false);
    const [erroSaida, setErroSaida] = useState("");

    const { areaAtual, irParaPessoal, irParaEquipe } = useArea();
    const { equipes, criarEquipe, recarregarEquipes } = useEquipes();
    const { usuarioLogado } = useAuth();
    const { adicionarMembro, buscarEquipesDoUsuario, buscarMembro, removerMembro } = useMembros();
    const { buscarCargoPorId } = useCargos();

    const buscarCargoUsuario = (equipeId) => {
        if (!usuarioLogado) {
            return null;
        }

        const membro = buscarMembro(
            usuarioLogado.id,
            equipeId
        );

        if (!membro) {
            return null;
        }

        return buscarCargoPorId(membro.cargoId);
    };

    const menuAberto = Boolean(aberto);
    const idsEquipesUsuario = usuarioLogado ? buscarEquipesDoUsuario(usuarioLogado.id) : [];
    const equipesUsuario = equipes.filter((equipe) => idsEquipesUsuario.some((equipeId) => String(equipeId) === String(equipe.id)));

    const abrirCriarEquipe = () => {
        fecharMenu();
        setModalEquipeAberto(true);
    };

    const salvarEquipe = async (nome) => {
        if (!usuarioLogado) return;

        try {
            const novaEquipe = await criarEquipe(nome);
            adicionarMembro(usuarioLogado.id, novaEquipe.id, "dono");
            irParaEquipe(novaEquipe);
            setModalEquipeAberto(false);
        } catch (error) {
            console.error("Erro ao criar equipe:", error);
            throw error;
        }
    };

    const abrirMenu = (event) => {
        setAberto(event.currentTarget);
    };

    const fecharMenu = () => {
        setAberto(null);
    };

    const escolherPessoal = () => {
        irParaPessoal();
        fecharMenu();
    };

    const escolherEquipe = (equipe) => {
        irParaEquipe(equipe);
        fecharMenu();
    };

    const sairDaEquipe = async () => {
        if (saindoDaEquipe || !usuarioLogado || areaAtual.tipo !== "equipe") {
            return;
        }

        const equipeId = areaAtual.equipeId;
        const membro = buscarMembro(usuarioLogado.id, equipeId);

        if (!membro || membro.cargoId === "dono") {
            return;
        }

        setSaindoDaEquipe(true);
        setErroSaida("");

        try {
            const resultado = await removerMembro(usuarioLogado.id, equipeId);

            if (!resultado?.sucesso) {
                setErroSaida(resultado?.mensagem || "Não foi possível sair da equipe");
                return;
            }

            irParaPessoal();
            fecharMenu();

            try {
                await recarregarEquipes();
            } catch (error) {
                console.error("Erro ao atualizar as equipes:", error);
            }
        } catch (error) {
            setErroSaida(error.response?.data?.message || error.response?.data?.mensagem || "Não foi possível sair da equipe");
        } finally {
            setSaindoDaEquipe(false);
        }
    };

    return (
        <>
            <Button variant="text" onClick={abrirMenu} endIcon={<KeyboardArrowDownIcon sx={{ color: "primary.main" }} />} sx={{ color: "#F1F1EF", fontSize: 13, px: 1.5, minWidth: 0, "&:hover": { bgcolor: "rgba(255,255,255,0.07)" } }}>
                {areaAtual.nome}
            </Button>

            <Menu anchorEl={aberto} open={menuAberto} onClose={fecharMenu} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: { sx: { mt: 1, minWidth: 240, borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none", border: "1px solid", borderColor: "divider" } }
                }}
            >
                <MenuItem onClick={escolherPessoal} selected={areaAtual.tipo === "pessoal"}>
                    <PersonOutlineOutlinedIcon sx={{ mr: 1.5, fontSize: 19, color: "primary.main" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Minhas Tarefas
                    </Typography>
                </MenuItem>

                {equipesUsuario.length > 0 && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", px: 2, pb: 0.7, fontWeight: 700 }}>
                            EQUIPES
                        </Typography>

                        {equipesUsuario.map((equipe) => {
                            const cargo = buscarCargoUsuario(equipe.id);

                            return (
                                <MenuItem key={equipe.id} onClick={() => escolherEquipe(equipe)} selected={areaAtual.tipo === "equipe" && String(areaAtual.equipeId) === String(equipe.id)}>
                                    <GroupsOutlinedIcon sx={{ mr: 1.5, fontSize: 19, color: "text.secondary" }} />
                                    <Box>
                                        <Typography variant="body2">
                                            {equipe.nome}
                                        </Typography>
                                        {cargo && (
                                            <Typography variant="caption" color="text.secondary">
                                                {cargo.nome}
                                            </Typography>
                                        )}
                                    </Box>
                                </MenuItem>
                            );
                        })}
                    </>
                )}

                {areaAtual.tipo === "equipe" &&
                    usuarioLogado &&
                    (() => {
                        const membro = buscarMembro(usuarioLogado.id, areaAtual.equipeId);
                        return membro && membro.cargoId !== "dono";
                    })() && (
                        <>
                            <Divider sx={{ my: 1 }} />

                            <MenuItem onClick={sairDaEquipe} disabled={saindoDaEquipe} sx={{ color: "error.main" }}>
                                <LogoutOutlinedIcon sx={{ mr: 1.5, fontSize: 19 }} />

                                <Typography variant="body2">
                                    {saindoDaEquipe ? "Saindo da equipe..." : "Sair da equipe"}
                                </Typography>
                            </MenuItem>
                        </>
                    )}

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={abrirCriarEquipe}>
                    <AddOutlinedIcon sx={{ mr: 1.5, fontSize: 19, color: "primary.main" }} />
                    <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                        Criar equipe
                    </Typography>
                </MenuItem>
            </Menu>

            <Snackbar open={Boolean(erroSaida)} autoHideDuration={5000} onClose={() => setErroSaida("")}>
                <Alert severity="error" onClose={() => setErroSaida("")}>
                    {erroSaida}
                </Alert>
            </Snackbar>

            <ModalEquipe aberto={modalEquipeAberto} aoFechar={() => setModalEquipeAberto(false)} aoCriar={salvarEquipe} />
        </>
    );
}

export default SeletorArea;