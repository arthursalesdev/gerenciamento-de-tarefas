import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../../context/authContext";

function ModalPerfil({ aberto, aoFechar }) {
    const { usuarioLogado } = useAuth();

    return (
        <Dialog
            open={aberto}
            onClose={aoFechar}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 0.8,
                    bgcolor: "background.paper",
                    backgroundImage: "none",
                    border: "1px solid",
                    borderColor: "divider"
                }
            }}
        >
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ position: "relative", mb: 3 }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                            pr: 5
                        }}
                    >
                        Meu perfil
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Consulte suas informações pessoais
                    </Typography>

                    <IconButton
                        onClick={aoFechar}
                        size="small"
                        aria-label="Fechar perfil"
                        sx={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            color: "text.secondary"
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Stack spacing={2.2}>
                    <TextField
                        label="Nome"
                        value={usuarioLogado?.nome || ""}
                        slotProps={{ input: { readOnly: true } }}
                        fullWidth
                    />

                    <TextField
                        label="Nome de usuário"
                        value={usuarioLogado?.nomeUsuario || ""}
                        slotProps={{ input: { readOnly: true } }}
                        fullWidth
                    />

                    <TextField
                        label="Tag"
                        value={usuarioLogado?.tag ? `#${usuarioLogado.tag}` : ""}
                        slotProps={{ input: { readOnly: true } }}
                        fullWidth
                    />

                    <TextField
                        label="E-mail"
                        type="email"
                        value={usuarioLogado?.email || ""}
                        slotProps={{ input: { readOnly: true } }}
                        fullWidth
                    />
                </Stack>

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="contained"
                        onClick={aoFechar}
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            px: 3,
                            "&:hover": {
                                bgcolor: "primary.dark"
                            }
                        }}
                    >
                        Fechar
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPerfil;