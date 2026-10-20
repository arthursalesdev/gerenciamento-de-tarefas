import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, MenuItem, Stack, TextField, Typography } from "@mui/material";

function ModalTransferencia({ aberto, aoFechar, membros = [], aoConfirmar }) {
    const [novoDonoId, setNovoDonoId] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (aberto) {
            setNovoDonoId("");
            setErro("");
        }
    }, [aberto]);

    const confirmar = () => {
        if (!novoDonoId) {
            setErro("Selecione o novo dono");
            return;
        }
        aoConfirmar(novoDonoId);
    };

    return (
        <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="xs" PaperProps={{sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none", border: "1px solid", borderColor: "divider" }}}>
            <DialogContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, textTransform: "uppercase" }}>
                    Transferir equipe
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    Escolha quem será o novo dono da equipe
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <TextField select label="Novo dono" value={novoDonoId} error={Boolean(erro)} helperText={erro} fullWidth
                        onChange={(event) => {
                            setNovoDonoId(event.target.value);
                            setErro("");
                        }}
                    >
                        {membros.map((membro) => (
                            <MenuItem key={membro.id} value={membro.usuarioId}>
                                {membro.nome}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                    Após a transferência, você continuará na equipe como membro
                </Typography>
                
                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 3 }}>
                    <Button variant="text" color="inherit" onClick={aoFechar} sx={{ color: "text.secondary" }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={confirmar}>
                        Transferir
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalTransferencia;