import { Box, Button, Container, Stack, Typography } from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function CtaFinal({ aoComecar, aoEntrar }) {
    return (
        <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xl">
                <Box sx={{ maxWidth: 950, mx: "auto", p: { xs: 2.5, sm: 3, md: 3.5 }, borderRadius: 0.8, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", position: "relative", overflow: "hidden",  "&:hover": { transform: "translateY(-3px)", borderColor: "primary.main" } }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 280px" }, gap: { xs: 3, md: 5 }, alignItems: "stretch", width: "100%" }}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: { xs: "0.72rem", md: "0.8rem" } }}>
                                Pronto para começar?
                            </Typography>
                            <Typography component="h2" sx={{ mt: 0.6, fontSize: { xs: "1.45rem", sm: "1.65rem", md: "1.8rem" }, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.015em" }}>
                                Organize seu trabalho{" "}
                                <Box component="span" sx={{ color: "primary.main" }}>
                                    em um só lugar
                                </Box>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, maxWidth: 500, lineHeight: 1.6 }}>
                                Tarefas pessoais e da equipe, organizadas de forma simples e clara
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Stack spacing={0.8} alignItems="center" sx={{ width: "100%", maxWidth: 220 }}>
                                <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} fullWidth onClick={aoComecar} sx={{ py: 0.9, bgcolor: "primary.main", color: "primary.contrastText" }}>
                                    Começar agora
                                </Button>
                                <Button variant="outlined" color="inherit" fullWidth onClick={aoEntrar} sx={{ fontSize: "0.8rem", color: "text.secondary", borderColor: "primary.main", "&:hover": { color: "text.primary", bgcolor: "transparent" } }}>
                                    Já tenho uma conta
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default CtaFinal;