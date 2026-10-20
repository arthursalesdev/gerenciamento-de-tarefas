import { Box, Button, Container, Stack, Typography } from "@mui/material";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import DemoPainel from "../DemoPainel/demoPainel";

function HeroLanding() {
    return (
        <Box component="section" sx={{ minHeight: { md: "calc(100vh - 110px)" }, display: "flex", alignItems: "center", py: { xs: 5, sm: 6, md: 8 } }}>
            <Container maxWidth="xl">
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.85fr) minmax(0, 1.15fr)" }, alignItems: "center", gap: { xs: 4, sm: 5, lg: 3, xl: 0 } }}>
                    <Box sx={{ maxWidth: { xs: 650, lg: 620 } }}>
                        <Typography component="h1" sx={{ fontSize: { xs: "2.15rem", sm: "3rem", md: "4rem", xl: "4.4rem" }, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em" }}>
                            Organize suas tarefas
                            <Box component="br" sx={{ display: { xs: "none", sm: "block" } }} /> {" "}
                            Trabalhe melhor em{" "}
                            <Box component="span" sx={{ color: "primary.main" }}>
                                equipe
                            </Box>
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mt: { xs: 2, sm: 2.5, md: 3}, maxWidth: 560, fontSize: { xs: "1rem", md: "1.08rem" }, lineHeight: 1.7 }}>
                            Gerencie suas tarefas pessoais e organize
                            o trabalho da sua equipe em um único
                            espaço, com responsabilidades, prazos e
                            progresso sempre visíveis
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} spacing={1.5} sx={{ mt: {xs: 3, md: 4} }}>
                            <Button variant="contained" size="large" sx={{ px: 3, py: 1.2 }}>
                                Começar agora
                            </Button>
                            <Button variant="text" color="inherit" href="#recursos" size="large" endIcon={<KeyboardArrowDownRoundedIcon />} sx={{ color: "text.secondary" }}>
                                Conhecer recursos
                            </Button>
                        </Stack>
                    </Box>

                    <Box sx={{ width: "100%", minWidth: 0 }}>
                        <DemoPainel />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default HeroLanding;