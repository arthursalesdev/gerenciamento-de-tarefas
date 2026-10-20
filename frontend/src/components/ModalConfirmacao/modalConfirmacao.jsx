import { Box, Button, Dialog, DialogContent, Divider, Stack, Typography } from "@mui/material";

function ModalConfirmacao({ aberto, aoFechar, aoConfirmar, nomeTarefa }) {
    return (
        <Dialog open={aberto} onClose={aoFechar}
            PaperProps={{
                sx: {
                    width: 390, m: 2, borderRadius: 0.8, bgcolor: (theme) => theme.palette.mode === "dark" ? "#23262D" : "#FAF9F6",
                    backgroundImage: "none", overflow: "hidden", border: "1px solid", borderColor: "divider", maxWidth: "calc(100% - 32px)"
                }
            }}
        >
            <DialogContent sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Excluir tarefa
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                    Você está prestes a remover esta tarefa:
                </Typography>

                <Box sx={{ mt: 2, px: 2, py: 1.5, borderRadius: 0.8, bgcolor: (theme) => theme.palette.mode === "dark" ? "#1D2026" : "#F1EFEA", border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Typography sx={{ color: "primary.main", fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: "1rem" }}>
                            {">"}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {nomeTarefa}
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>
            <Divider />
            <Box sx={{ px: 3, py: 2, bgcolor: (theme) => theme.palette.mode === "dark" ? "#1F2228" : "#F3F2EF", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="text" color="inherit" onClick={aoFechar} sx={{ color: "text.secondary", minHeight: 38, px: 1.5 }}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={aoConfirmar} sx={{ minWidth: 88, minHeight: 38, px: 2 }}>
                    Excluir
                </Button>
            </Box>
        </Dialog>
    );
}

export default ModalConfirmacao;