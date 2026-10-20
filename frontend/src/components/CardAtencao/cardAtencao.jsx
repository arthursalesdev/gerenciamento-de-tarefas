import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";

function CardAtencao({
    tarefas = [], atrasadas = 0, hoje = 0, proximas = 0, semResponsavel = 0,
    areaPessoalAtiva, buscarOrigem, buscarResponsavel
}) {
    const diferencaEmDias = (dataLimite) => {
        if (!dataLimite) {
            return null;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const limite = new Date(`${dataLimite}T00:00:00`);
        return Math.round((limite - hoje) / (1000 * 60 * 60 * 24));
    };

    const obterSituacao = (tarefa) => {
        if (!tarefa.dataLimite) {
            return null;
        }

        const dias = diferencaEmDias(tarefa.dataLimite);

        if (dias < 0) {
            const atraso = Math.abs(dias);

            return {
                texto: atraso === 1 ? "Atrasada · 1 dia" : `Atrasada · ${atraso} dias`,
                cor: "error.main"
            };
        }

        if (dias === 0) {
            return {texto: "Vence hoje", cor: "warning.main"};
        }

        return {
            texto: dias === 1 ? "Amanhã" : `${dias} dias`,
            cor: "primary.main"
        };
    };

    return (
        <Card sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 0.8, height: "100%", minWidth: 0, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                    Atenção
                </Typography>

                <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                    <Chip label={`${atrasadas} atrasadas`} size="small" color={ atrasadas > 0 ? "error" : "default" } variant="outlined" sx={{ height: 24, fontSize: "0.7rem" }} />
                    <Chip label={`${hoje} hoje`} size="small" color={ hoje > 0 ? "warning" : "default" } variant="outlined" sx={{ height: 24, fontSize: "0.7rem" }} />

                    {areaPessoalAtiva ? (
                        <Chip label={`${proximas} próximas`} size="small" color={ proximas > 0 ? "primary" : "default" } variant="outlined" sx={{ height: 24, fontSize: "0.7rem" }} />
                    ) : (
                        <Chip label={`${semResponsavel} sem responsável`} size="small" color={ semResponsavel > 0 ? "primary" : "default" } variant="outlined" sx={{ height: 24, fontSize: "0.7rem" }} />
                    )}
                </Stack>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {tarefas.length === 0 ? (
                <Box sx={{ minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", px: 2 }} >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Tudo em dia
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, maxWidth: 280 }} >
                        Nenhuma tarefa precisa de atenção no momento.
                    </Typography>
                </Box>
            ) : (
                <Stack divider={<Divider flexItem />} spacing={0} >
                    {tarefas.map((tarefa) => {
                        const situacao = obterSituacao(tarefa);
                        const informacao = areaPessoalAtiva ? buscarOrigem(tarefa) : buscarResponsavel(tarefa.usuarioId);

                        return (
                            <Box key={tarefa.id} sx={{ py: 1.1, minWidth: 0 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {tarefa.titulo}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {informacao}
                                        </Typography>
                                    </Box>

                                    {situacao && (
                                        <Typography variant="caption" sx={{ color: situacao.cor, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, fontSize: { xs: "0.68rem", sm: "0.72rem" } }}>
                                            {situacao.texto}
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Card>
    );
}

export default CardAtencao;