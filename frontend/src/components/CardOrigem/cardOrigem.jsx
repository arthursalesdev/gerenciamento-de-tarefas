import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";

function CardOrigem({ origens = [] }) {
    const maiorQuantidade = Math.max(...origens.map((origem) => origem.quantidade), 1);

    return (
        <Card sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 0.8, height: "100%", minWidth: 0, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Origem das minhas tarefas
            </Typography>

            <Box sx={{ mt: 1.5 }}>
                {origens.length === 0 ? (
                    <Box sx={{ minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", px: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Nenhuma tarefa ativa
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, maxWidth: 280 }}>
                            Você não possui tarefas pendentes ou em andamento.
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={1.7}>
                        {origens.map((origem) => {
                            const percentual = (origem.quantidade / maiorQuantidade) * 100;

                            return (
                                <Box key={origem.id} sx={{ minWidth: 0 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mb: 0.6, minWidth: 0 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {origem.nome}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, flexShrink: 0 }}>
                                            {origem.quantidade}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={percentual} sx={{ height: 6, borderRadius: 999, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { borderRadius: 999 }}} />
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </Box>
        </Card>
    );
}

export default CardOrigem;