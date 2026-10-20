import { Box, Container, Typography } from "@mui/material";

function ComoFunciona() {
    const passos = [
        {
            numero: "01",
            titulo: "Crie suas tarefas",
            descricao: "Registre o que precisa ser feito, defina prazos e organize suas tarefas pessoais ou da equipe"
        },
        {
            numero: "02",
            titulo: "Monte sua equipe",
            descricao: "Adicione membros, defina cargos e permissões e distribua responsabilidades entre a equipe"
        },
        {
            numero: "03",
            titulo: "Acompanhe tudo",
            descricao: "Visualize prioridades, prazos e progresso pelos painéis e saiba onde sua atenção é necessária"
        }
    ];

    return (
        <Box component="section" id="como-funciona" sx={{ py: { xs: 7, md: 9 }}}>
            <Container maxWidth="xl">
                <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "center", mb: { xs: 5, md: 7 } }}>
                    <Typography sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: { xs: "0.75rem", md: "1.15rem" } }}>
                        Como funciona
                    </Typography>
                    <Typography component="h2" sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                        Da tarefa ao resultado,{" "}
                        <Box component="span" sx={{ color: "primary.main" }}>
                            sem complicação
                        </Box>
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 2, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7 }}>
                        Organize seu trabalho em poucos passos e acompanhe
                        o que importa do início ao fim
                    </Typography>
                </Box>

                <Box sx={{ position: "relative", maxWidth: 1050, mx: "auto", display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 4, md: 5 } }}>
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", top: 28, left: "16.666%", right: "16.666%", height: "1px", bgcolor: "divider", zIndex: 0 }} />

                    {passos.map((passo) => (
                        <Box key={passo.numero} sx={{ position: "relative", zIndex: 1, textAlign: "center", minWidth: 0 }}>
                            <Box sx={{ width: 56, height: 56, mx: "auto", borderRadius: "50%", bgcolor: "background.default", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography sx={{ color: "primary.main", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                                    {passo.numero}
                                </Typography>
                            </Box>
                            <Typography sx={{ mt: 2, fontSize: { xs: "1.1rem", md: "1.2rem" }, fontWeight: 700, lineHeight: 1.3 }}>
                                {passo.titulo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mx: "auto", maxWidth: 290, lineHeight: 1.7 }}>
                                {passo.descricao}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

export default ComoFunciona;