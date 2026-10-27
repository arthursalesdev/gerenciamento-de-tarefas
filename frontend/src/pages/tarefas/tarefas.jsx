import { useState } from "react";

import { Alert, Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { Navbar } from "../../components/Navbar/navbar";
import CardTarefa from "../../components/CardTarefa/cardTarefa";
import CabecalhoColuna from "../../components/CabecalhoColuna/cabecalho";
import ModalTarefa from "../../components/ModalTarefa/modalTarefa";
import ModalConfirmacao from "../../components/ModalConfirmacao/modalConfirmacao";

import { useTarefas } from "../../context/tarefasContext";
import { useAuth } from "../../context/authContext";
import { useArea } from "../../context/areaContext";
import { useEquipes } from "../../context/equipesContext";
import { useMembros } from "../../context/membrosContext";
import { usePermissoes } from "../../context/permissoesContext";

function Tarefas() {
    const [modalAberto, setModalAberto] = useState(false);
    const [modoModal, setModoModal] = useState("criar");
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
    const [erroOperacao, setErroOperacao] = useState("");

    const { areaAtual, areaPessoalAtiva } = useArea();
    const { usuarioLogado, usuarios } = useAuth();
    const { tarefas, criarTarefa, atualizarTarefa, excluirTarefa } = useTarefas();
    const { equipes } = useEquipes();
    const { buscarMembrosDaEquipe } = useMembros();
    const { pode } = usePermissoes();

    const membrosDaEquipe = areaPessoalAtiva ? [] : buscarMembrosDaEquipe(areaAtual.equipeId);

    const responsaveis = areaPessoalAtiva
        ? usuarioLogado
            ? [usuarioLogado] : []
        : membrosDaEquipe.map((membro) => membro.usuario).filter(Boolean);

    const podeAlterarTarefa = pode("editarTarefa") || pode("alterarStatus") || pode("alterarResponsavel") || pode("alterarData");

    const buscarMeuCargoNaEquipe = (equipeId) => {
        const membro = buscarMembrosDaEquipe(equipeId).find((item) => String(item.usuarioId) === String(usuarioLogado?.id));

        return membro?.cargoId ?? null;
    };

    const podeEditarTarefa = (tarefa) => {
        if (tarefa.equipeId == null) {
            return podeAlterarTarefa;
        }

        const cargo = buscarMeuCargoNaEquipe(tarefa.equipeId);

        if (cargo === "dono" || cargo === "lider") {
            return true;
        }

        if (cargo === "membro") {
            return (tarefa.responsavelId != null && String(tarefa.responsavelId) === String(usuarioLogado?.id));
        }

        return false;
    };

    const podeExcluirTarefa = (tarefa) => {
        if (tarefa.equipeId == null) {
            return pode("excluirTarefa");
        }

        const cargo = buscarMeuCargoNaEquipe(tarefa.equipeId);

        return cargo === "dono" || cargo === "lider";
    };

    const buscarOrigemTarefa = (tarefa) => {
        if (!tarefa.equipeId) {
            return "Pessoal";
        }

        const equipe = equipes.find((equipe) => String(equipe.id) === String(tarefa.equipeId));
        return equipe?.nome || "Equipe";
    };

    const tarefasDaArea = areaPessoalAtiva
        ? tarefas.filter((tarefa) => {
            if (tarefa.equipeId != null) {
                return String(tarefa.responsavelId) === String(usuarioLogado?.id);
            }

            return String(tarefa.usuarioId) === String(usuarioLogado?.id);
        })
        : tarefas.filter((tarefa) => String(tarefa.equipeId) === String(areaAtual.equipeId));


    const buscarUsuario = (usuarioId, equipeId = null) => {
        if (usuarioId === null || usuarioId === undefined) {
            return null;
        }

        if (String(usuarioLogado?.id) === String(usuarioId)) {
            return usuarioLogado;
        }

        if (equipeId != null) {
            const membro = buscarMembrosDaEquipe(equipeId).find((item) => String(item.usuarioId) === String(usuarioId));

            if (membro?.usuario) {
                return membro.usuario;
            }
        }

        return usuarios.find((usuario) => String(usuario.id) === String(usuarioId)) || null;
    };

    const buscarResponsavel = (tarefa) => {
        const responsavelId =
            tarefa.responsavelId ??
            (tarefa.origemPersistencia === "local"
                ? tarefa.usuarioId : null);

        return buscarUsuario(responsavelId, tarefa.equipeId);
    };

    const abrirModalCriar = () => {
        setModoModal("criar");
        setTarefaSelecionada(null);
        setModalAberto(true);
    };

    const abrirModalEditar = (tarefa) => {
        setModoModal("editar");
        setTarefaSelecionada(tarefa);
        setModalAberto(true);
    };

    const abrirModalExcluir = (tarefa) => {
        setTarefaParaExcluir(tarefa);
        setModalExcluirAberto(true);
    };

    const confirmarExclusao = async () => {
        if (!tarefaParaExcluir) {
            return;
        }

        setErroOperacao("");

        try {
            await excluirTarefa(tarefaParaExcluir.id, tarefaParaExcluir);
            setModalExcluirAberto(false);
            setTarefaParaExcluir(null);
        } catch (error) {
            setErroOperacao(error.response?.data?.message || error.response?.data?.mensagem || error.message || "Não foi possível excluir a tarefa");
        }
    };

    const tarefasPendentes = tarefasDaArea.filter((tarefa) => tarefa.status === "pendente");
    const tarefasAndamento = tarefasDaArea.filter((tarefa) => tarefa.status === "andamento");
    const tarefasConcluidas = tarefasDaArea.filter((tarefa) => tarefa.status === "concluido");

    const tarefaEditadaDeEquipe = modoModal === "editar" && tarefaSelecionada?.equipeId != null;

    const equipeDoModal = tarefaEditadaDeEquipe
        ? tarefaSelecionada.equipeId
        : areaPessoalAtiva
            ? null : areaAtual.equipeId;

    const cargoNoModal = equipeDoModal != null ? buscarMeuCargoNaEquipe(equipeDoModal) : null;
    const podeAdministrarResponsavel = cargoNoModal === "dono" || cargoNoModal === "lider";
    const responsaveisDoModal = equipeDoModal == null ? responsaveis : buscarMembrosDaEquipe(equipeDoModal).map((membro) => membro.usuario).filter(Boolean);
    const podeEditarNoModal = tarefaEditadaDeEquipe ? podeEditarTarefa(tarefaSelecionada) : pode("editarTarefa");

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary", transition: "background-color 0.2s ease" }}>
            <Box sx={{ height: { xs: 100, md: 110 } }} />
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: { xs: 3, md: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ position: "relative", width: "100%", mb: { xs: 2, md: 2.5 } }}>
                    <Typography variant="h4" component="h1" sx={{ fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, pr: { xs: 0, sm: 22 } }}>
                        {areaPessoalAtiva ? (
                            "Minhas Tarefas"
                        ) : (
                            <>
                                Tarefas ·{" "}
                                <Box component="span" sx={{ color: "primary.main" }}>
                                    {areaAtual.nome}
                                </Box>
                            </>
                        )}
                    </Typography>
                    {pode("criarTarefa") && (
                        <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={abrirModalCriar}
                            sx={{
                                position: { xs: "static", sm: "absolute" }, top: "50%", right: 0, transform: { xs: "none", sm: "translateY(-50%)" }, mt: { xs: 2, sm: 0 },
                                bgcolor: "primary.main", color: "primary.contrastText", px: 2.5, py: 1, "&:hover": { bgcolor: "primary.dark" }
                            }}
                        >
                            Nova tarefa
                        </Button>
                    )}
                </Box>
                {erroOperacao && (
                    <Alert severity="error" onClose={() => setErroOperacao("")} sx={{ mb: 2 }}>
                        {erroOperacao}
                    </Alert>
                )}
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
                    <Card sx={{ p: 2, flex: 1, width: "100%", minWidth: 0 }}>
                        <CabecalhoColuna titulo="Pendentes" quantidade={tarefasPendentes.length} status="pendente" />
                        <Stack spacing={2}>
                            {tarefasPendentes.map((tarefa) => (
                                <CardTarefa key={`${tarefa.origemPersistencia}-${tarefa.equipeId ?? "pessoal"}-${tarefa.id}`} {...tarefa} usuario={buscarResponsavel(tarefa)} origem={areaPessoalAtiva ? buscarOrigemTarefa(tarefa) : null} podeEditar={podeEditarTarefa(tarefa)} podeExcluir={podeExcluirTarefa(tarefa)} aoEditar={() => abrirModalEditar(tarefa)} aoExcluir={() => abrirModalExcluir(tarefa)} />

                            ))}
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, flex: 1, width: "100%", minWidth: 0 }}>
                        <CabecalhoColuna titulo="Em Andamento" quantidade={tarefasAndamento.length} status="andamento" />
                        <Stack spacing={2}>
                            {tarefasAndamento.map((tarefa) => (
                                <CardTarefa key={`${tarefa.origemPersistencia}-${tarefa.equipeId ?? "pessoal"}-${tarefa.id}`} {...tarefa} usuario={buscarResponsavel(tarefa)} origem={areaPessoalAtiva ? buscarOrigemTarefa(tarefa) : null} podeEditar={podeEditarTarefa(tarefa)} podeExcluir={podeExcluirTarefa(tarefa)} aoEditar={() => abrirModalEditar(tarefa)} aoExcluir={() => abrirModalExcluir(tarefa)} />
                            ))}
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, flex: 1, width: "100%", minWidth: 0 }}>
                        <CabecalhoColuna titulo="Concluído" quantidade={tarefasConcluidas.length} status="concluido" />
                        <Stack spacing={2}>
                            {tarefasConcluidas.map((tarefa) => (
                                <CardTarefa key={`${tarefa.origemPersistencia}-${tarefa.equipeId ?? "pessoal"}-${tarefa.id}`} {...tarefa} usuario={buscarResponsavel(tarefa)} origem={areaPessoalAtiva ? buscarOrigemTarefa(tarefa) : null} podeEditar={podeEditarTarefa(tarefa)} podeExcluir={podeExcluirTarefa(tarefa)} aoEditar={() => abrirModalEditar(tarefa)} aoExcluir={() => abrirModalExcluir(tarefa)} />
                            ))}
                        </Stack>
                    </Card>
                </Stack>
            </Container>
            <ModalTarefa
                aberto={modalAberto} aoFechar={() => setModalAberto(false)} modo={modoModal} tarefaSelecionada={tarefaSelecionada} responsaveis={responsaveisDoModal} areaPessoal={equipeDoModal == null} podeEditar={podeEditarNoModal}
                podeAlterarStatus={tarefaEditadaDeEquipe ? podeEditarNoModal : pode("alterarStatus")}
                podeAlterarResponsavel={equipeDoModal != null ? podeAdministrarResponsavel : pode("alterarResponsavel")}
                podeAlterarData={tarefaEditadaDeEquipe ? podeEditarNoModal : pode("alterarData")}

                aoSalvar={async (dados) => {
                    if (modoModal === "editar") {
                        await atualizarTarefa(tarefaSelecionada.id, dados, tarefaSelecionada);
                    } else {
                        await criarTarefa({
                            ...dados,
                            equipeId: areaPessoalAtiva ? null : areaAtual.equipeId
                        });
                    }
                }}
            />
            <ModalConfirmacao aberto={modalExcluirAberto} aoConfirmar={confirmarExclusao} nomeTarefa={tarefaParaExcluir?.titulo}
                aoFechar={() => {
                    setModalExcluirAberto(false);
                    setTarefaParaExcluir(null);
                }}
            />
        </Box>
    );
}

export default Tarefas;