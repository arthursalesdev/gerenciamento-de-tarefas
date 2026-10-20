import { Box, Card, Stack, Typography } from "@mui/material";

function CardDistribuicao({ pendentes = 0, andamento = 0, concluidas = 0 }) {
    const total = pendentes + andamento + concluidas;
    const percentualPendentes = total > 0 ? (pendentes / total) * 100 : 0;
    const percentualAndamento = total > 0 ? (andamento / total) * 100 : 0;
    const percentualConcluidas = total > 0 ? (concluidas / total) * 100 : 0;

    const legenda = [
        { nome: "Pendentes", quantidade: pendentes, cor: "warning.main" },
        { nome: "Em andamento", quantidade: andamento, cor: "info.main" },
        { nome: "Concluídas", quantidade: concluidas, cor: "success.main" }
    ];

    return (
        <Card sx={{ p: 2, borderRadius: 0.8, height: "100%", minHeight: { xs: 150, lg: 105 }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            {total === 0 ? (
                <Stack sx={{ height: "100%", justifyContent: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Distribuição por status
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        A equipe ainda não possui tarefas
                    </Typography>
                </Stack>
            ) : (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Distribuição por status
                        </Typography>

                        <Typography sx={{ ml: "auto", fontSize: { xs: "1rem", lg: "1.05rem" }, fontWeight: 700, color: "text.primary", whiteSpace: "nowrap" }}>
                            {total}{" "}
                            <Box component="span" sx={{ fontSize: "0.75rem", fontWeight: 500, color: "text.secondary" }}>
                                {total === 1 ? "tarefa" : "tarefas"}
                            </Box>
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", width: "100%", height: 8, mt: 1.5, borderRadius: 999, overflow: "hidden", bgcolor: "action.hover" }}>
                        {pendentes > 0 && (
                            <Box sx={{ width: `${percentualPendentes}%`, bgcolor: "warning.main" }} />
                        )}
                        {andamento > 0 && (
                            <Box sx={{ width: `${percentualAndamento}%`, bgcolor: "info.main" }} />
                        )}
                        {concluidas > 0 && (
                            <Box sx={{ width: `${percentualConcluidas}%`, bgcolor: "success.main" }} />
                        )}
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, lg: 2.5 }} sx={{ mt: 1.2, minWidth: 0 }}>
                        {legenda.map((item) => (
                            <Stack key={item.nome} direction="row" alignItems="center" spacing={0.6} sx={{ minWidth: 0 }}>
                                <Typography variant="caption" sx={{ color: item.cor, fontWeight: 600, whiteSpace: "nowrap" }}>
                                    {item.nome}
                                </Typography>
                                <Typography variant="caption" sx={{ color: item.cor, fontWeight: 700 }}>
                                    {item.quantidade}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </>
            )}
        </Card>
    );
}

export default CardDistribuicao;