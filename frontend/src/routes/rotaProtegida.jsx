import { Navigate } from "react-router-dom";

import { useAuth } from "../context/authContext";

function RotaProtegida({ children }) {
    const { estaLogado } = useAuth();

    if (!estaLogado) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RotaProtegida;