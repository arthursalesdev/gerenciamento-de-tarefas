import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Box, Button, Card, Container, Stack, Typography, Chip, MenuItem, TextField } from "@mui/material";

import { Navbar } from "../../components/Navbar/navbar";
import ModalTransferencia from "../../components/ModalTransf/modalTransf";
import AvatarUsuario from "../../components/AvatarUsuario/avatarUsuario";

import { useArea } from "../../context/areaContext";
import { useAuth } from "../../context/authContext";
import { useMembros } from "../../context/membrosContext";
import { useCargos } from "../../context/cargosContext";
import { usePermissoes } from "../../context/permissoesContext";
import { useConvites } from "../../context/convitesContext";
import { useTarefas } from "../../context/tarefasContext";

function Gerenciamento() {
    const navigate = useNavigate();

    const { areaAtual, areaPessoalAtiva, irParaPessoal } = useArea();
    const { usuarios, usuarioLogado, buscarUsuarioPorIdentidade } = useAuth();
    const { buscarMembrosDaEquipe, alterarCargo, buscarMembro, transferirPropriedade, removerMembro, podeSairDaEquipe, podeRemoverMembro } = useMembros();
    const { buscarCargoPorId, cargos } = useCargos();
    const { pode } = usePermissoes();
    const { enviarConvite } = useConvites();
    const { removerResponsavelDaEquipe } = useTarefas();

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [tag, setTag] = useState("");
    const [cargoConvite, setCargoConvite] = useState("membro");
    const [mensagemConvite, setMensagemConvite] = useState("");
    const [modalTransferenciaAberto, setModalTransferenciaAberto] = useState(false);

    if (!pode("gerenciarMembros")) {
        return <Navigate to="/tarefas" replace />;
    }

    if (areaPessoalAtiva) {
        return <Navigate to="/tarefas" replace />;
    }

    const membros = areaPessoalAtiva ? [] : buscarMembrosDaEquipe(areaAtual.equipeId);

    const buscarUsuario = (usuarioId) => {
        return usuarios.find(
            (usuario) => String(usuario.id) === String(usuarioId)
        );
    };

    const membroAtual = buscarMembro(usuarioLogado?.id, areaAtual.equipeId);
    const ehDono = membroAtual?.cargoId === "dono";

    const membrosTransferencia = membros
        .filter(
            (membro) => String(membro.usuarioId) !== String(usuarioLogado?.id)
        )
        .map((membro) => {
            const usuario = buscarUsuario(membro.usuarioId);
            return {
                ...membro, nome: usuario?.nome || "Usuário"
            };
        });

    const convidarUsuario = () => {
        setMensagemConvite("");
        const usuario = buscarUsuarioPorIdentidade(nomeUsuario, tag);

        if (!usuario) {
            setMensagemConvite("Usuário não encontrado");
            return;
        }

        if (String(usuario.id) === String(usuarioLogado?.id)) {
            setMensagemConvite("Você já faz parte desta equipe");
            return;
        }

        const resultado = enviarConvite({ equipeId: areaAtual.equipeId, convidadoId: usuario.id, convidadorId: usuarioLogado.id, cargoId: cargoConvite });

        if (!resultado.sucesso) {
            setMensagemConvite(resultado.mensagem);
            return;
        }

        setNomeUsuario("");
        setTag("");
        setCargoConvite("membro");
        setMensagemConvite("Convite enviado");
    };

    const cargosDisponiveis = cargos.filter((cargo) => cargo.id !== "dono");

    const mudarCargo = (membro, novoCargoId) => {
        if (!pode("gerenciarPermissoes")) {
            return;
        }

        if (membro.cargoId === "dono") {
            return;
        }

        if (novoCargoId === "dono") {
            return;
        }

        alterarCargo(membro.usuarioId, membro.equipeId, novoCargoId);
    };

    const sairDaEquipe = () => {
        if (!podeSairDaEquipe(usuarioLogado.id, areaAtual.equipeId)) {
            return;
        }

        removerResponsavelDaEquipe(usuarioLogado.id, areaAtual.equipeId);
        const resultado = removerMembro(usuarioLogado.id, areaAtual.equipeId);

        if (!resultado.sucesso) {
            return;
        }

        irParaPessoal();
        navigate("/tarefas");
    };

    const removerUsuarioDaEquipe = (membro) => {
        if (!podeRemoverMembro(usuarioLogado.id, membro.usuarioId, areaAtual.equipeId)) {
            return;
        }

        removerResponsavelDaEquipe(membro.usuarioId, areaAtual.equipeId);
        removerMembro(membro.usuarioId, areaAtual.equipeId);
    };

    return (
        <>
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
                <Box sx={{ height: { xs: 100, md: 110 } }} />

                <Navbar />

                <Container maxWidth="xl" sx={{ mt: { xs: 3, md: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
                    <Typography variant="h4" component="h1" sx={{ fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, mb: 2.5 }}>
                        Gerenciamento · <Box component="span" sx={{ color: "primary.main" }}>{areaAtual.nome}</Box>
                    </Typography>

                    <Card sx={{ p: 2.5, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                            Adicionar membro
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Encontre um usuário pelo nome de usuário e tag.
                        </Typography>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField label="Nome de usuário" value={nomeUsuario} onChange={(event) => setNomeUsuario(event.target.value)} fullWidth />
                            <TextField label="Tag" placeholder="#abc1234" value={tag} onChange={(event) => setTag(event.target.value)} />
                            <TextField select label="Cargo" value={cargoConvite} onChange={(event) => setCargoConvite(event.target.value)} sx={{ minWidth: 160 }}>
                                {pode("gerenciarPermissoes") && (
                                    <MenuItem value="lider">
                                        Líder
                                    </MenuItem>
                                )}
                                <MenuItem value="membro">
                                    Membro
                                </MenuItem>
                                <MenuItem value="visualizador">
                                    Visualizador
                                </MenuItem>
                            </TextField>
                            <Button variant="contained" onClick={convidarUsuario} sx={{ bgcolor: "primary.main", whiteSpace: "nowrap", px: 3 }}>
                                Enviar convite
                            </Button>
                        </Stack>

                        {mensagemConvite && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                {mensagemConvite}
                            </Typography>
                        )}
                    </Card>

                    <Card sx={{ p: 2.5, width: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }} >
                            Membros
                        </Typography>

                        <Stack spacing={1.5}>
                            {membros.map((membro) => {
                                const usuario = buscarUsuario(membro.usuarioId);
                                const cargo = buscarCargoPorId(membro.cargoId);

                                const podeRemover = podeRemoverMembro(usuarioLogado.id, membro.usuarioId, areaAtual.equipeId);

                                return (
                                    <Box key={membro.id}
                                        sx={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, border: "1px solid",
                                            borderColor: "divider", borderRadius: 0.8, bgcolor: (theme) => theme.palette.mode === "dark" ? "#1D2026" : "#FFFFFF"
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <AvatarUsuario usuario={usuario} tamanho="pequeno" animado/>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {usuario?.nome || "Usuário"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" >
                                                    {usuario?.email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            {membro.cargoId === "dono" ? (
                                                <Chip label="Dono" size="small" color="warning" />
                                            ) : pode("gerenciarPermissoes") ? (
                                                <TextField select size="small" value={membro.cargoId} onChange={(event) => mudarCargo(membro, event.target.value)} sx={{ minWidth: 140 }} >
                                                    {cargosDisponiveis.map((cargo) => (
                                                        <MenuItem key={cargo.id} value={cargo.id}>
                                                            {cargo.nome}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                <Chip label={cargo?.nome || "Sem cargo"} size="small" variant="outlined" />
                                            )}

                                            {podeRemover && (
                                                <Button variant="text" color="error" onClick={() => removerUsuarioDaEquipe(membro)}>
                                                    Remover
                                                </Button>
                                            )}
                                        </Stack>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Card>
                    {!ehDono && (
                        <Button variant="text" color="error" onClick={sairDaEquipe} sx={{ mt: 3 }}>
                            Sair da equipe
                        </Button>
                    )}
                    {ehDono && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }} >
                            Para sair da equipe, transfira a propriedade primeiro
                        </Typography>
                    )}
                    {ehDono && membrosTransferencia.length > 0 && (
                        <Button variant="outlined" onClick={() => setModalTransferenciaAberto(true)} sx={{ mt: 3 }}>
                            Transferir propriedade
                        </Button>
                    )}
                </Container>
            </Box>
            <ModalTransferencia aberto={modalTransferenciaAberto} aoFechar={() => setModalTransferenciaAberto(false)} membros={membrosTransferencia}
                aoConfirmar={(novoDonoId) => {
                    const resultado = transferirPropriedade(areaAtual.equipeId, usuarioLogado.id, novoDonoId);

                    if (resultado.sucesso) {
                        setModalTransferenciaAberto(false);
                    }
                }}
            />
        </>
    );
}

export default Gerenciamento;