import { useState } from "react";
import { Alert, Box, Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";

import { useAuth } from "../../context/authContext";
import { useEquipes } from "../../context/equipesContext";
import { useConvites } from "../../context/convitesContext";

function ModalConvites({ aberto, aoFechar }) {
    const { usuarioLogado } = useAuth();
    const { buscarEquipePorId } = useEquipes();
    const { convitesApi, carregandoConvites, erroConvites, aceitarConvite, recusarConvite } = useConvites();

    const [processandoId, setProcessandoId] = useState(null);
    const [erroOperacao, setErroOperacao] = useState("");

    const convites = usuarioLogado ? convitesApi.filter((convite) => String(convite.convidadoId) === String(usuarioLogado.id)) : [];

    const responderConvite = async (conviteId, acao) => {
        if (processandoId !== null) return;

        setProcessandoId(conviteId);
        setErroOperacao("");

        try {
            if (acao === "aceitar") {
                await aceitarConvite(conviteId);
            } else {
                await recusarConvite(conviteId);
            }
        } catch (error) {
            setErroOperacao(
                error.response?.data?.message || error.response?.data?.mensagem ||
                error.message || "Não foi possível responder ao convite"
            );
        } finally {
            setProcessandoId(null);
        }
    };

    return (
        <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 0.8, bgcolor: "background.paper", backgroundImage: "none" } }}>
            <DialogContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, textTransform: "uppercase" }}>
                    Convites
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    Convites pendentes para equipes
                </Typography>

                {(erroConvites || erroOperacao) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {erroOperacao || erroConvites}
                    </Alert>
                )}

                {carregandoConvites && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Carregando convites...
                    </Typography>
                )}

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
                                        <Button variant="text" color="inherit" onClick={() => responderConvite(convite.id, "recusar")} disabled={processandoId !== null} sx={{ color: "text.secondary" }}>
                                            {processandoId === convite.id ? "Processando..." : "Recusar"}
                                        </Button>
                                        <Button variant="contained" onClick={() => responderConvite(convite.id, "aceitar")} disabled={processandoId !== null}>
                                            {processandoId === convite.id ? "Processando..." : "Aceitar"}
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