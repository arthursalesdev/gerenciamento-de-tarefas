import { useState } from "react";

import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
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

    const { areaAtual, areaPessoalAtiva } = useArea();
    const { usuarioLogado, usuarios } = useAuth();
    const { tarefas, criarTarefa, atualizarTarefa, excluirTarefa } = useTarefas();
    const { equipes } = useEquipes();
    const { buscarMembrosDaEquipe } = useMembros();
    const { pode } = usePermissoes();

    const responsaveis = areaPessoalAtiva
        ? usuarioLogado
            ? [usuarioLogado] : []
        : buscarMembrosDaEquipe(areaAtual.equipeId)
            .map((membro) => usuarios.find((usuario) => String(usuario.id) === String(membro.usuarioId))).filter(Boolean);

    const podeAlterarTarefa = pode("editarTarefa") || pode("alterarStatus") || pode("alterarResponsavel") || pode("alterarData");

    const buscarOrigemTarefa = (tarefa) => {
        if (!tarefa.equipeId) {
            return "Pessoal";
        }

        const equipe = equipes.find((equipe) => String(equipe.id) === String(tarefa.equipeId));
        return equipe?.nome || "Equipe";
    };

    console.log("tarefas:", tarefas);
    console.log("é array?", Array.isArray(tarefas));
    console.log("areaPessoalAtiva:", areaPessoalAtiva);
    console.log("usuarioLogado:", usuarioLogado);
    console.log("areaAtual:", areaAtual);

    const tarefasDaArea = areaPessoalAtiva
        ? tarefas.filter((tarefa) => String(tarefa.usuarioId) === String(usuarioLogado?.id))
        : tarefas.filter((tarefa) => String(tarefa.equipeId) === String(areaAtual.equipeId));

    const buscarUsuario = (usuarioId) => {
        if (!usuarioId) {
            return null;
        }

        return (
            usuarios.find((usuario) => String(usuario.id) === String(usuarioId)) || null
        );
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

    const confirmarExclusao = () => {
        if (!tarefaParaExcluir) {
            return;
        }

        excluirTarefa(tarefaParaExcluir.id);
        setModalExcluirAberto(false);
        setTarefaParaExcluir(null);
    };

    const tarefasPendentes = tarefasDaArea.filter((tarefa) => tarefa.status === "pendente");
    const tarefasAndamento = tarefasDaArea.filter((tarefa) => tarefa.status === "andamento");
    const tarefasConcluidas = tarefasDaArea.filter((tarefa) => tarefa.status === "concluido");

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
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
                    <Card sx={{ p: 2, flex: 1, width: "100%", minWidth: 0 }}>
                        <CabecalhoColuna titulo="Pendentes" quantidade={tarefasPendentes.length} status="pendente" />
                        <Stack spacing={2}>
                            {tarefasPendentes.map((tarefa) => (
                                <CardTarefa key={tarefa.id} {...tarefa} usuario={buscarUsuario(tarefa.usuarioId)} origem={areaPessoalAtiva ? buscarOrigemTarefa(tarefa) : null} podeEditar={podeAlterarTarefa} podeExcluir={pode("excluirTarefa")} aoEditar={() => abrirModalEditar(tarefa)} aoExcluir={() => abrirModalExcluir(tarefa)} />

                            ))}
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, flex: 1, width: "100%", minWidth: 0 }}>
                        <CabecalhoColuna titulo="Em Andamento" quantidade={tarefasAndamento.length} status="andamento" />
                        <Stack spacing={2}>
                            {tarefasAndamento.map((tarefa) => (
                                <CardTarefa key={tarefa.id} {...tarefa} usuario={buscarUsuario(tarefa.usuarioId)} origem={areaPessoalAtiva ? buscarOrigemTarefa(tarefa) : null} podeEditar={podeAlterarTarefa} podeExcluir={pode("excluirTarefa")} aoEditar={() => abrirModalEditar(tarefa)} aoExcluir={() => abrirModalExcluir(tarefa)} />
                            ))}
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, flex: 1, width: "100%", minWidth: 0 }}>
                        <CabecalhoColuna titulo="Concluído" quantidade={tarefasConcluidas.length} status="concluido" />
                        <Stack spacing={2}>
                            {tarefasConcluidas.map((tarefa) => (
                                <CardTarefa key={tarefa.id} {...tarefa} usuario={buscarUsuario(tarefa.usuarioId)} origem={areaPessoalAtiva ? buscarOrigemTarefa(tarefa) : null} podeEditar={podeAlterarTarefa} podeExcluir={pode("excluirTarefa")} aoEditar={() => abrirModalEditar(tarefa)} aoExcluir={() => abrirModalExcluir(tarefa)} />
                            ))}
                        </Stack>
                    </Card>
                </Stack>
            </Container>
            <ModalTarefa
                aberto={modalAberto} aoFechar={() => setModalAberto(false)} modo={modoModal} tarefaSelecionada={tarefaSelecionada} responsaveis={responsaveis} areaPessoal={areaPessoalAtiva}
                podeEditar={pode("editarTarefa")} podeAlterarStatus={pode("alterarStatus")} podeAlterarResponsavel={pode("alterarResponsavel")} podeAlterarData={pode("alterarData")}

                aoSalvar={(dados) => {
                    if (modoModal === "editar") {
                        atualizarTarefa(tarefaSelecionada.id, dados);
                    } else {
                        criarTarefa({ ...dados, equipeId: areaPessoalAtiva ? null : areaAtual.equipeId });
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