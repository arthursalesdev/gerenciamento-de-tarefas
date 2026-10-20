import { Box, Card, Container, Stack, Typography } from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import AvatarUsuario from "../../AvatarUsuario/avatarUsuario";

function PessoalEquipe() {
    const membrosDemo = [
        {
            id: "demo-arthur",
            nome: "Arthur"
        },
        {
            id: "demo-marina",
            nome: "Marina"
        },
        {
            id: "demo-joao",
            nome: "João"
        }
    ];
    return (
        <Box component="section" sx={{ pt: { xs: 5, sm: 6, md: 6 }, pb: { xs: 6, sm: 7, md: 8 } }}>
            <Container maxWidth="xl">
                <Box sx={{ maxWidth: 700, mx: "auto", textAlign: "center", mb: { xs: 3.5, sm: 4.5, md: 5 } }}>
                    <Typography sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1.15rem" } }}>
                        Organize do seu jeito
                    </Typography>
                    <Typography component="h2" sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                        Um espaço para você
                        <Box component="br" sx={{ display: { xs: "none", sm: "block" } }} /> {" "}
                        Outro para sua{" "}
                        <Box component="span" sx={{ color: "primary.main" }}>
                            equipe
                        </Box>
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 2, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7 }}>
                        Separe suas tarefas pessoais do trabalho
                        compartilhado sem perder a organização
                    </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 2, sm: 2.5, md: 3 }, maxWidth: 1100, mx: "auto" }}>
                    <Card sx={{ p: { xs: 2.5, sm: 3, md: 3 }, height: "100%", borderRadius: 0.8, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
                        <Stack direction="row" alignItems="center" spacing={1.2}>
                            <Box sx={{ width: 38, height: 38, borderRadius: 0.8, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main" }}>
                                <PersonOutlineRoundedIcon />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Pessoal
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Seu espaço individual
                                </Typography>
                            </Box>
                        </Stack>
                        <Box sx={{ mt: { xs: 2.5, md: 3 } }}>
                            <Typography sx={{ fontSize: { xs: "1.25rem", md: "1.4rem" }, fontWeight: 700, lineHeight: 1.25 }}>
                                Organize o que é só seu
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 430, lineHeight: 1.7 }}>
                                Mantenha suas tarefas pessoais separadas do
                                trabalho das equipes, com uma visão clara do
                                que precisa da sua atenção
                            </Typography>
                            <Stack spacing={0.9} sx={{ mt: 2 }}>
                                {[
                                    "Tarefas pessoais", "Prazos e acompanhamento", "Progresso individual"
                                ].map((item) => (
                                    <Stack key={item} direction="row" alignItems="center" spacing={1}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <CheckRoundedIcon sx={{ fontSize: 14, color: "primary.main" }} />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {item}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                            <Card variant="outlined" sx={{ mt: 2.5, p: 2.2, minHeight: 160, position: "relative", bgcolor: (theme) => theme.palette.mode === "dark" ? "#1D2026" : "#FFFFFF", borderColor: "divider", borderRadius: 0.8, boxShadow: "none" }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.35 }}>
                                    Preparar apresentação
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4, fontWeight: 500 }}>
                                    Pessoal
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
                                    Organizar os pontos principais da apresentação
                                </Typography>

                                <Box sx={{ mt: 3, width: "100%", display: { xs: "flex", sm: "block" }, flexDirection: "column", gap: { xs: 1.5, sm: 0 }, position: { xs: "static", sm: "relative" }, minHeight: { xs: "auto", sm: 42 } }}>
                                    <Box sx={{ position: "absolute", left: 0, bottom: 0 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ position: { xs: "static", sm: "absolute" }, left: { sm: 0 }, bottom: { sm: 0 } }}>
                                            Responsável
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            Arthur
                                        </Typography>
                                    </Box>

                                    <Box sx={{ position: { xs: "static", sm: "absolute" }, right: { sm: 0 }, bottom: { sm: 0 }, textAlign: { xs: "left", sm: "right" } }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.72rem", mb: 0.5 }}>
                                            Data limite
                                        </Typography>
                                        <Stack direction="row" alignItems="center" justifyContent={{xs: "flex-start", sm: "flex-end"}} spacing={0.5}>
                                            <EventOutlinedIcon sx={{ fontSize: 15, color: "warning.main" }} />
                                            <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                                                Amanhã
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    </Card>

                    <Card sx={{ p: { xs: 2.5, md: 3 }, width: "100%", borderRadius: 0.8, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", position: "relative" }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: "100%" }}>
                            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
                                <Box sx={{ width: 38, height: 38, borderRadius: 0.8, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", flexShrink: 0 }}>
                                    <GroupsOutlinedIcon />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        Equipe
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Seu espaço compartilhado
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" alignItems="center" sx={{ position: "absolute", top: { xs: 20, md: 24 }, right: { xs: 20, md: 24 }, alignItems: "center" }}>
                                {membrosDemo.map((membro, index) => (
                                    <Box key={membro.id} sx={{ ml: index === 0 ? 0 : -0.7, position: "relative", zIndex: membrosDemo.length - index, "& > *": { border: "2px solid", borderColor: "background.paper" } }}>
                                        <AvatarUsuario usuario={membro} tamanho="pequeno" />
                                    </Box>
                                ))}

                                <Box sx={{ ml: -0.7, width: 32, height: 32, borderRadius: "50%", bgcolor: "background.default", border: "2px solid", borderColor: "background.paper", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: 700 }}>
                                        +2
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ fontSize: { xs: "1.25rem", md: "1.4rem" }, fontWeight: 700, lineHeight: 1.25 }}>
                                Trabalhe junto, sem perder o controle
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 430, lineHeight: 1.7 }}>
                                Organize tarefas e responsabilidades entre os
                                membros da equipe, mantendo o trabalho
                                compartilhado claro para todos
                            </Typography>

                            <Stack spacing={0.9} sx={{ mt: 2 }}>
                                {[
                                    "Responsáveis por tarefa", "Membros, cargos e permissões", "Acompanhamento compartilhado"
                                ].map((item) => (
                                    <Stack key={item} direction="row" alignItems="center" spacing={1}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <CheckRoundedIcon sx={{ fontSize: 14, color: "primary.main" }} />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {item}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>

                            <Card variant="outlined" sx={{ mt: 2.5, p: 2.2, minHeight: 160, position: "relative", bgcolor: (theme) => theme.palette.mode === "dark" ? "#1D2026" : "#FFFFFF", borderColor: "divider", borderRadius: 0.8, boxShadow: "none" }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.35 }}>
                                    Revisar interface
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4, fontWeight: 500 }}>
                                    Desenvolvimento
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
                                    Ajustar a interface antes da próxima entrega.
                                </Typography>
                                <Box sx={{ mt: 3, position: "relative", width: "100%", minHeight: 42 }}>
                                    <Box sx={{ position: "absolute", left: 0, bottom: 0 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.72rem", mb: 0.5 }}>
                                            Responsável
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={0.7}>
                                            <AvatarUsuario usuario={membrosDemo[0]} tamanho="mini" />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                Arthur
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ position: "absolute", right: 0, bottom: 0, textAlign: "right" }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.72rem", mb: 0.5 }}>
                                            Data limite
                                        </Typography>
                                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                                            <EventOutlinedIcon sx={{ fontSize: 15, color: "warning.main" }} />
                                            <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                                                Hoje
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

export default PessoalEquipe;