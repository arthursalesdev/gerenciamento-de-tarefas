import { Box, Card, Container, Typography } from "@mui/material";

import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";

function Recursos() {
    const recursos = [
        {
            id: "tarefas",
            titulo: "Organize suas tarefas",
            descricao: "Defina prazos, status e responsáveis para manter suas atividades organizadas",
            detalhes: "Tarefas · Prazos · Status",
            icone: TaskAltOutlinedIcon
        },
        {
            id: "equipe",
            titulo: "Trabalhe em equipe",
            descricao: "Distribua tarefas e responsabilidades entre os membros da equipe",
            detalhes: "Membros · Responsáveis",
            icone: GroupsOutlinedIcon
        },
        {
            id: "acesso",
            titulo: "Controle de acesso",
            descricao: "Defina cargos e controle o que cada membro pode fazer dentro da equipe",
            detalhes: "Cargos · Permissões",
            icone: AdminPanelSettingsOutlinedIcon
        },
        {
            id: "progresso",
            titulo: "Acompanhe o progresso",
            descricao: "Tenha uma visão clara das tarefas, atrasos e do andamento do trabalho",
            detalhes: "Painéis · Indicadores",
            icone: QueryStatsOutlinedIcon
        }
    ];

    return (
        <Box component="section" id="recursos" sx={{ py: { xs: 7, md: 9 }}}>
            <Container maxWidth="xl">
                <Box sx={{ maxWidth: 680, mx: "auto", textAlign: "center", mb: { xs: 4, md: 5 }}}>
                    <Typography sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: { xs: "0.75rem", md: "1.15rem" } }}>
                        Recursos
                    </Typography>
                    <Typography component="h2" sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                        Feito para manter{" "}
                        <Box component="span" sx={{ color: "primary.main" }}>
                            tudo claro
                        </Box>
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 2, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7 }}>
                        Do planejamento individual ao trabalho em equipe,
                        organize responsabilidades sem complicar o fluxo
                    </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2, maxWidth: 1000, mx: "auto" }}>
                    {recursos.map((recurso) => {
                        const Icone = recurso.icone;

                        return (
                            <Card key={recurso.id}
                                sx={{
                                    p: { xs: 2.5, md: 3 }, minHeight: { xs: "auto", md: 220 }, display: "flex", flexDirection: "column", borderRadius: 0.8, bgcolor: "background.paper", border: "1px solid",
                                    borderColor: "divider", boxShadow: "none", transition: "transform 0.2s ease, border-color 0.2s ease", "&:hover": { transform: "translateY(-3px)", borderColor: "primary.main" }
                                }}
                            >
                                <Box sx={{ width: 42, height: 42, borderRadius: 0.8, bgcolor: "action.hover", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Icone sx={{ fontSize: 23 }} />
                                </Box>
                                <Typography sx={{ mt: 2, fontSize: { xs: "1.1rem", md: "1.2rem" }, fontWeight: 700, lineHeight: 1.3 }}>
                                    {recurso.titulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7, maxWidth: 390 }}>
                                    {recurso.descricao}
                                </Typography>
                                <Typography variant="caption" sx={{ display: "block", mt: "auto", pt: 2.5, color: "warning.main", fontWeight: 700, letterSpacing: "0.015em" }}>
                                    {recurso.detalhes}
                                </Typography>
                            </Card>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}

export default Recursos;