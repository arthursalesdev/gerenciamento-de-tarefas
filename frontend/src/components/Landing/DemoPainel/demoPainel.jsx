import { useState } from "react";
import { Box, Button, Card, LinearProgress, Stack, Typography } from "@mui/material";


function DemoPainel() {
    const [visualizacao, setVisualizacao] = useState("equipe");
    const dadosPessoal = {
        nome: "Minhas Tarefas",
        resumos: [
            {
                titulo: "Pendentes", quantidade: 4, cor: "warning.main"
            },
            {
                titulo: "Em andamento", quantidade: 2, cor: "info.main"
            },
            {
                titulo: "Concluídas", quantidade: 8, cor: "success.main"
            },
            {
                titulo: "Atrasadas", quantidade: 1, cor: "error.main"
            }
        ],

        atencao: { titulo: "Entregar documentação", origem: "Pessoal", prazo: "Hoje" },
        progresso: { percentual: 53, concluidas: 8, total: 15 }
    };

    const dadosEquipe = {
        nome: "Desenvolvimento",
        resumos: [
            {
                titulo: "Pendentes", quantidade: 3, cor: "warning.main"
            },
            {
                titulo: "Em andamento", quantidade: 4, cor: "info.main"
            },
            {
                titulo: "Concluídas", quantidade: 6, cor: "success.main"
            },
            {
                titulo: "Atrasadas", quantidade: 2, cor: "error.main"
            }
        ],

        atencao: { titulo: "Revisar autenticação", origem: "Desenvolvimento", prazo: "Hoje" },
        progresso: { percentual: 40, concluidas: 6, total: 15 },
        distribuicao: { pendentes: 3, andamento: 4, concluidas: 6 }
    };

    const dados = visualizacao === "pessoal" ? dadosPessoal : dadosEquipe;
    const distribuicao = dadosEquipe.distribuicao;

    const totalDistribuicao =
        distribuicao.pendentes +
        distribuicao.andamento +
        distribuicao.concluidas;

    const percentualPendentes = (distribuicao.pendentes / totalDistribuicao) * 100;
    const percentualAndamento = (distribuicao.andamento / totalDistribuicao) * 100;
    const fimPendentes = percentualPendentes;
    const fimAndamento = percentualPendentes + percentualAndamento;

    return (
        <Box
            sx={{
                width: "100%", maxWidth: 820, mx: "auto", p: { xs: 1.5, sm: 2.2, lg: 2.5 },
                bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1.2,
                boxShadow: (theme) => theme.palette.mode === "dark" ? "0 18px 45px rgba(0,0,0,0.22)" : "0 18px 45px rgba(0,0,0,0.08)"
            }}
        >
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={{ xs: 1.2, sm: 2 }} sx={{ mb: 2 }} >
                <Typography sx={{ fontSize: { xs: "0.95rem", sm: "1.05rem" }, fontWeight: 700, minWidth: 0, flex: 1 }}>
                    Painel ·{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>
                        {dados.nome}
                    </Box>
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: { xs: 0, sm: "auto" }, alignSelf: { xs: "flex-end", sm: "auto" }, flexShrink: 0 }} >
                    <Button size="small" onClick={() => setVisualizacao("pessoal")}
                        sx={{ 
                            minWidth: 0, px: 1, py: 0.4, color: visualizacao === "pessoal" ? "primary.main" : "text.secondary",
                            fontWeight: visualizacao === "pessoal" ? 700 : 500, fontSize: "0.72rem", textTransform: "none",
                            borderRadius: 0, borderBottom: "2px solid", borderColor: visualizacao === "pessoal" ? "primary.main" : "transparent"
                        }}
                    >
                        Pessoal
                    </Button>

                    <Button size="small" onClick={() => setVisualizacao("equipe")}
                         sx={{ 
                            minWidth: 0, px: 1, py: 0.4, color: visualizacao === "equipe" ? "primary.main" : "text.secondary",
                            fontWeight: visualizacao === "equipe" ? 700 : 500, fontSize: "0.72rem", textTransform: "none",
                            borderRadius: 0, borderBottom: "2px solid", borderColor: visualizacao === "equipe" ? "primary.main" : "transparent"
                        }}
                    >
                        Equipe
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 1 }}>
                {dados.resumos.map((item) => (
                    <Card key={item.titulo}
                        sx={{
                            p: {xs: 1.2, sm: 1.5}, minHeight: {xs: 74, sm: 82}, position: "relative", overflow: "hidden", borderRadius: 0.8,
                            border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper"
                        }}
                    >
                        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, bgcolor: item.cor }} />

                        <Typography variant="caption" color="text.secondary"
                            sx={{
                                display: "block", fontSize: { xs: "0.6rem", sm: "0.62rem", lg: "0.7rem"}, fontWeight: 700, textTransform: "uppercase",
                                letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }}
                        >
                            {item.titulo}
                        </Typography>

                        <Typography sx={{ mt: 0.7, fontSize: { xs: "1.2rem", sm: "1.3rem", lg: "1.5rem"}, fontWeight: 700, lineHeight: 1, color: item.cor }}>
                            {item.quantidade}
                        </Typography>
                    </Card>
                ))}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.2fr) minmax(170px, 0.8fr)" }, gap: 1, mt: 1 }}>
                {visualizacao === "pessoal" ? (
                    <Card sx={{ p: {xs: 1.4, sm: 1.7}, minHeight: 125, borderRadius: 0.8, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Progresso
                            </Typography>
                            <Typography sx={{ ml: "auto", color: "primary.main", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1 }}>
                                {dados.progresso.percentual}%
                            </Typography>
                        </Stack>

                        <Box sx={{ mt: 2 }}>
                            <LinearProgress variant="determinate" value={dados.progresso.percentual} sx={{ height: 6, borderRadius: 999, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { borderRadius: 999 }}}/>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, fontSize: "0.67rem" }}>
                                {dados.progresso.concluidas} de{" "} {dados.progresso.total} concluídas
                            </Typography>
                        </Box>
                    </Card>
                ) : (
                    <Card sx={{ p: 1.7, minHeight: 125, borderRadius: 0.8, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Distribuição por status
                        </Typography>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mt: 1.2 }}>
                            <Stack spacing={0.45} sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" justifyContent="space-between" spacing={1}>
                                    <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 600 }}>
                                        Pendentes
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 700 }}>
                                        {distribuicao.pendentes}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between" spacing={1}>
                                    <Typography variant="caption" sx={{ color: "info.main", fontWeight: 600 }}>
                                        Em andamento
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "info.main", fontWeight: 700 }}>
                                        {distribuicao.andamento}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between" spacing={1}>
                                    <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600 }}>
                                        Concluídas
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700 }}>
                                        {distribuicao.concluidas}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box sx={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                                <Box
                                    sx={{
                                        width: "100%", height: "100%", borderRadius: "50%",
                                        background: (theme) => `
                                            conic-gradient(
                                                ${theme.palette.warning.main} 0% ${fimPendentes}%,
                                                ${theme.palette.info.main} ${fimPendentes}% ${fimAndamento}%,
                                                ${theme.palette.success.main} ${fimAndamento}% 100%
                                            )
                                        `
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "absolute", inset: 10, borderRadius: "50%", bgcolor: "background.paper",
                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                                    }}
                                >
                                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, lineHeight: 1 }}>
                                        {totalDistribuicao}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, fontSize: "0.52rem", lineHeight: 1 }}>
                                        tarefas
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Card>
                )}

                <Card sx={{ p: {xs: 1.3, sm: 1.5}, borderRadius: 0.8, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: "100%", minWidth: 0}}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Progresso
                        </Typography>
                        <Typography sx={{  ml: "auto", color: "primary.main", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1 }}>
                            {dados.progresso.percentual}%
                        </Typography>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                        <LinearProgress variant="determinate" value={dados.progresso.percentual} sx={{ height: 6, borderRadius: 999, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { borderRadius: 999 } }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, fontSize: "0.67rem" }}>
                            {dados.progresso.concluidas} de {dados.progresso.total} concluídas
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}

export default DemoPainel;