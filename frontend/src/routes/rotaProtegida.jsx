import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "../context/authContext";

function RotaProtegida({ children }) {
    const { estaLogado, verificandoSessao } = useAuth();

    if (verificandoSessao) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!estaLogado) {
        return <Navigate to="/" replace />;
    }

    return children ?? <Outlet />;
}

export default RotaProtegida;