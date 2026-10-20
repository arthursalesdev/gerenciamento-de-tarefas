import { Box, Container, Typography } from "@mui/material";

import { Navbar } from "../../components/Navbar/navbar";
import CardResumo from "../../components/CardResumo/cardResumo";
import CardAtencao from "../../components/CardAtencao/cardAtencao";
import CardProgresso from "../../components/CardProgresso/cardProgresso";
import CardOrigem from "../../components/CardOrigem/cardOrigem";
import CardDistribuicao from "../../components/CardDistribuicao/cardDistribuicao";
import CardCargaEquipe from "../../components/CardCargaEquipe/cardCargaEquipe";

import { useArea } from "../../context/areaContext";
import { useAuth } from "../../context/authContext";
import { useTarefas } from "../../context/tarefasContext";
import { useEquipes } from "../../context/equipesContext";
import { useMembros } from "../../context/membrosContext";

function Painel() {
    const { areaAtual, areaPessoalAtiva } = useArea();
    const { usuarioLogado, usuarios } = useAuth();
    const { tarefas } = useTarefas();
    const { equipes } = useEquipes();
    const { buscarMembrosDaEquipe } = useMembros();

    const obterDataLocal = (data) => {
        if (!data) {
            return null;
        }

        return new Date(`${data}T00:00:00`);
    };

    const obterHoje = () => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return hoje;
    };

    const diferencaEmDias = (dataLimite) => {
        const limite = obterDataLocal(dataLimite);

        if (!limite) {
            return null;
        }

        const hoje = obterHoje();
        return Math.round((limite - hoje) / (1000 * 60 * 60 * 24));
    };

    const tarefaEstaAtrasada = (tarefa) => {
        if (!tarefa.dataLimite || tarefa.status === "concluido") {
            return false;
        }

        return diferencaEmDias(tarefa.dataLimite) < 0;
    };

    const buscarNomeUsuario = (usuarioId) => {
        if (!usuarioId) {
            return "Sem responsável";
        }

        const usuario = usuarios.find((usuario) => String(usuario.id) === String(usuarioId));
        return usuario?.nome || "Usuário";
    };

    const buscarOrigemTarefa = (tarefa) => {
        if (!tarefa.equipeId) {
            return "Pessoal";
        }

        const equipe = equipes.find((equipe) => String(equipe.id) === String(tarefa.equipeId));
        return equipe?.nome || "Equipe";
    };

    const tarefasDaArea = areaPessoalAtiva
        ? tarefas.filter((tarefa) => String(tarefa.usuarioId) === String(usuarioLogado?.id))
        : tarefas.filter((tarefa) => String(tarefa.equipeId) === String(areaAtual?.equipeId));

    const tarefasPendentes = tarefasDaArea.filter((tarefa) => tarefa.status === "pendente");
    const tarefasAndamento = tarefasDaArea.filter((tarefa) => tarefa.status === "andamento");
    const tarefasConcluidas = tarefasDaArea.filter((tarefa) => tarefa.status === "concluido");
    const tarefasAtivas = tarefasDaArea.filter((tarefa) => tarefa.status === "pendente" || tarefa.status === "andamento");
    const tarefasAtrasadas = tarefasDaArea.filter(tarefaEstaAtrasada);

    const tarefasVencemHoje = tarefasDaArea.filter(
        (tarefa) => {
            if (!tarefa.dataLimite || tarefa.status === "concluido") {
                return false;
            }

            return diferencaEmDias(tarefa.dataLimite) === 0;
        }
    );

    const tarefasProximas = tarefasDaArea.filter(
        (tarefa) => {
            if (!tarefa.dataLimite || tarefa.status === "concluido") {
                return false;
            }

            const dias = diferencaEmDias(tarefa.dataLimite);
            return dias >= 1 && dias <= 3;
        }
    );

    const tarefasAtencao = [...tarefasAtrasadas, ...tarefasVencemHoje, ...tarefasProximas].sort((a, b) => obterDataLocal(a.dataLimite) - obterDataLocal(b.dataLimite));
    const tarefasSemResponsavel = areaPessoalAtiva ? [] : tarefasAtivas.filter((tarefa) => !tarefa.usuarioId);
    const tarefasAtencaoEquipe = [...tarefasAtencao, ...tarefasSemResponsavel.filter((tarefa) => !tarefasAtencao.some((item) => item.id === tarefa.id))];
    const tarefasAtencaoVisiveis = (areaPessoalAtiva ? tarefasAtencao : tarefasAtencaoEquipe).slice(0, 5);

    const origensTarefas = areaPessoalAtiva
        ? tarefasAtivas.reduce(
            (origens, tarefa) => { 
                const idOrigem = tarefa.equipeId ? `equipe-${tarefa.equipeId}` : "pessoal";
                const origemExistente = origens.find((origem) => origem.id === idOrigem);

                if (origemExistente) {
                    origemExistente.quantidade += 1;
                    return origens;
                }

                origens.push({id: idOrigem, nome: buscarOrigemTarefa(tarefa), quantidade: 1});
                return origens;
            },
            []
        )
        : [];

    origensTarefas.sort((a, b) => b.quantidade - a.quantidade);
    const membrosEquipe = areaPessoalAtiva ? [] : buscarMembrosDaEquipe(areaAtual?.equipeId);

    const cargaMembros = !areaPessoalAtiva
        ? membrosEquipe.map((membro) => {
            const usuario = usuarios.find((usuario) => String(usuario.id) === String(membro.usuarioId));
            const quantidade = tarefasAtivas.filter((tarefa) => String(tarefa.usuarioId) === String(membro.usuarioId)).length;
            return { id: membro.usuarioId, usuario, nome: usuario?.nome || "Usuário", quantidade };
        })
        : [];

    cargaMembros.sort((a, b) => b.quantidade - a.quantidade);

    const quantidadeSemResponsavel = areaPessoalAtiva ? 0 : tarefasAtivas.filter((tarefa) => !tarefa.usuarioId).length;
    const cargaEquipe = [...cargaMembros];

    if (quantidadeSemResponsavel > 0) {
        cargaEquipe.push({id: "sem-responsavel", nome: "Sem responsável", quantidade: quantidadeSemResponsavel});
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary", transition: "background-color 0.2s ease" }}>
            <Navbar />
            <Box sx={{height: { xs: 100, md: 110 }}}/>
            <Container maxWidth="xl" sx={{ mt: { xs: 2.5, md: 4 }, mb: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
                <Typography variant="h4" component="h1" sx={{ fontSize: { xs: "1.65rem", sm: "2.1rem", md: "2.4rem" }, mb: { xs: 2, md: 2.5 }, overflowWrap: "anywhere" }}>
                    Painel ·{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>
                        {areaPessoalAtiva ? "Minhas Tarefas" : areaAtual?.nome}
                    </Box>
                </Typography>

                <Box
                    sx={{
                        display: "grid", gap: 2, mb: { xs: 2, md: 3 }, alignItems: "stretch",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", lg: "repeat(4, minmax(140px, 0.75fr)) minmax(280px, 2fr)" },
                    }}
                >
                    <CardResumo titulo="Pendentes" quantidade={tarefasPendentes.length} cor="warning.main" />
                    <CardResumo titulo="Em andamento" quantidade={tarefasAndamento.length} cor="info.main" />
                    <CardResumo titulo="Concluídas" quantidade={tarefasConcluidas.length} cor="success.main" />
                    <CardResumo titulo="Atrasadas" quantidade={tarefasAtrasadas.length} cor="error.main" />

                    <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1", md: "1 / -1", lg: "auto" }, minWidth: 0 }}>
                        {areaPessoalAtiva ? (
                            <CardProgresso total={tarefasDaArea.length} concluidas={tarefasConcluidas.length} />
                        ) : (
                            <CardDistribuicao pendentes={tarefasPendentes.length} andamento={tarefasAndamento.length} concluidas={tarefasConcluidas.length} />
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }, gap: 2, mb: { xs: 2, md: 3 }, alignItems: "stretch" }}>
                    <CardAtencao tarefas={tarefasAtencaoVisiveis} atrasadas={tarefasAtrasadas.length} hoje={tarefasVencemHoje.length} proximas={tarefasProximas.length} semResponsavel={tarefasSemResponsavel.length} areaPessoalAtiva={areaPessoalAtiva} buscarOrigem={buscarOrigemTarefa} buscarResponsavel={buscarNomeUsuario} />

                    {areaPessoalAtiva ? (
                        <CardOrigem origens={origensTarefas} />
                    ) : (
                        <CardCargaEquipe membros={cargaEquipe} />
                    )}
                </Box>
            </Container>
        </Box>
    );
}

export default Painel;