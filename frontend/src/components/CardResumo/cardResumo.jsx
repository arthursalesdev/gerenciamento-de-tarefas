import { Box, Card, Typography } from "@mui/material";

function CardResumo({ titulo, quantidade = 0, cor = "text.primary" }) {
    return (
        <Card
            sx={{
                p: { xs: 2, lg: 2 }, minWidth: 0, minHeight: { xs: 110, lg: 105 }, height: "100%", borderRadius: 0.8, position: "relative", overflow: "hidden",
                bgcolor: "background.paper", border: "1px solid", borderColor: "divider", boxShadow: "none", display: "flex", flexDirection: "column", justifyContent: "center"
            }}
        >
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, bgcolor: cor }} />

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: { xs: "0.78rem", lg: "0.72rem", xl: "0.8rem" }, lineHeight: 1.3 }}>
                {titulo}
            </Typography>

            <Typography sx={{ mt: 1.2, fontSize: { xs: "1.8rem", lg: "2rem" }, lineHeight: 1, fontWeight: 700, color: cor }}>
                {quantidade}
            </Typography>
        </Card>
    );
}

export default CardResumo;