import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ModalEquipe({ aberto, aoFechar, aoCriar }) {
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (aberto) {
            setNome("");
            setErro("");
        }
    }, [aberto]);

    const criar = () => {
        if (!nome.trim()) {
            setErro("Informe o nome da equipe");
            return;
        }
        aoCriar(nome.trim());
    };

    const fechar = () => {
        setNome("");
        setErro("");
        aoFechar();
    };

    return (
        <Dialog open={aberto} onClose={fechar} fullWidth maxWidth="xs"
            PaperProps={{ sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none", border: "1px solid", borderColor: "divider" } }}
        >
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ position: "relative", mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", pr: 5 }}>
                        Criar equipe
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Crie um espaço para organizar tarefas em equipe
                    </Typography>
                    <IconButton onClick={fechar} size="small" sx={{ position: "absolute", top: -4, right: -4, color: "text.secondary" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <TextField
                    label="Nome da equipe" value={nome} error={Boolean(erro)} helperText={erro} fullWidth autoFocus
                    onChange={(event) => {
                        setNome(event.target.value);
                        setErro("");
                    }}
                />

                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1.5} sx={{ mt: 3 }}>
                    <Button variant="text" color="inherit" onClick={fechar} sx={{ color: "text.secondary" }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={criar} sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 3, "&:hover": { bgcolor: "primary.dark" }}}>
                        Criar
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalEquipe;