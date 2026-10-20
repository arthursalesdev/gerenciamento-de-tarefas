import { Box, Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";

import { useAuth } from "../../context/authContext";
import { useEquipes } from "../../context/equipesContext";
import { useConvites } from "../../context/convitesContext";

function ModalConvites({ aberto, aoFechar }) {
    const { usuarioLogado } = useAuth();
    const { buscarEquipePorId } = useEquipes();
    const { buscarConvitesDoUsuario, aceitarConvite, recusarConvite } = useConvites();

    const convites = usuarioLogado ? buscarConvitesDoUsuario(usuarioLogado.id) : [];

    return (
        <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none" } }}>
            <DialogContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, textTransform: "uppercase" }}>
                    Convites
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    Convites pendentes para equipes
                </Typography>

                {convites.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Nenhum convite pendente
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        {convites.map((convite) => {
                            const equipe = buscarEquipePorId(convite.equipeId);

                            return (
                                <Box key={convite.id}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {equipe?.nome || "Equipe"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Você foi convidado para participar desta equipe
                                    </Typography>

                                    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1.5 }}>
                                        <Button variant="text" color="inherit" onClick={() => recusarConvite(convite.id)} sx={{ color: "text.secondary" }}>
                                            Recusar
                                        </Button>
                                        <Button variant="contained" onClick={() => aceitarConvite(convite.id)}>
                                            Aceitar
                                        </Button>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ModalConvites;