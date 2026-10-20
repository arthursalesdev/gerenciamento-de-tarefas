import { Box, Typography } from "@mui/material";

function CabecalhoColuna({ titulo, quantidade, status }) {
    const configuracao = {
        pendente: { cor: "#D98A4E" },
        andamento: { cor: "#7697B8" },
        concluido: { cor: "#79A58B" }
    };

    const statusAtual = configuracao[status] || configuracao.pendente;

    return (
        <Box sx={{ position: "relative", width: "100%", mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, pr: 5 }}>
                {titulo}
            </Typography>
            <Typography sx={{ position: "absolute", top: "50%", right: 5, transform: "translateY(-50%)", color: statusAtual.cor, fontWeight: 700, fontSize: "1rem" }}>
                {quantidade}
            </Typography>
        </Box>
    );
}

export default CabecalhoColuna;