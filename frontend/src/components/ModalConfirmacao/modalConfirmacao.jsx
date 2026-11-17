import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    Typography
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function ModalConfirmacao({
    aberto,
    aoFechar,
    aoConfirmar,
    nomeTarefa
}) {
    return (
        <Dialog
            open={aberto}
            onClose={aoFechar}
            fullWidth
            maxWidth="xs"
            aria-labelledby="titulo-excluir-tarefa"
            aria-describedby="descricao-excluir-tarefa"
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
            <DialogContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ position: "relative", pr: 5 }}>
                    <Typography
                        id="titulo-excluir-tarefa"
                        variant="h6"
                        component="h2"
                    >
                        Excluir tarefa
                    </Typography>

                    <Typography
                        id="descricao-excluir-tarefa"
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, lineHeight: 1.6 }}
                    >
                        Tem certeza de que deseja excluir esta tarefa?
                    </Typography>

                    <IconButton
                        aria-label="Fechar"
                        onClick={aoFechar}
                        size="small"
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

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mt: 2.5,
                        px: 2,
                        py: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 0.8,
                        bgcolor: "background.default"
                    }}
                >
                    <DeleteOutlineOutlinedIcon
                        color="error"
                        fontSize="small"
                        aria-hidden="true"
                    />

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            overflowWrap: "anywhere"
                        }}
                    >
                        {nomeTarefa}
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={aoFechar}
                        sx={{ color: "text.secondary" }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={aoConfirmar}
                        sx={{ px: 3 }}
                    >
                        Excluir
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ModalConfirmacao;