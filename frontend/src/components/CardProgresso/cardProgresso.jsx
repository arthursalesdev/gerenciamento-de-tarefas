import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";

function CardProgresso({ total = 0, concluidas = 0 }) {
    const restantes = Math.max(total - concluidas, 0);
    const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return (
        <Card sx={{ p: 2, borderRadius: 0.8, height: "100%", minHeight: { xs: 150, lg: 105 }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            {total === 0 ? (
                <Stack sx={{ height: "100%", minHeight: { xs: 110, lg: 65 }, justifyContent: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Progresso
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Nenhuma tarefa para acompanhar
                    </Typography>
                </Stack>
            ) : (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Progresso
                        </Typography>
                        <Typography sx={{ ml: "auto", fontSize: { xs: "1.5rem", lg: "1.6rem" }, fontWeight: 700, lineHeight: 1, color: "primary.main" }}>
                            {percentual}%
                        </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={percentual} sx={{ mt: 1.5, height: 7, borderRadius: 999, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { borderRadius: 999 }}} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 1.2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                            <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
                                {concluidas} de {total}
                            </Box>
                            {" "}{total === 1 ? "concluída" : "concluídas"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                            {restantes === 1 ? "1 restante" : `${restantes} restantes`}
                        </Typography>
                    </Stack>
                </>
            )}
        </Card>
    );
}

export default CardProgresso;