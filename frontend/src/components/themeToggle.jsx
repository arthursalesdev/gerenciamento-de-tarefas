import { IconButton, Tooltip } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

import { useTema } from "../context/temaContext";

function ThemeToggle() {
    const { modo, alternarTema } = useTema();

    return (
        <Tooltip title={ modo === "light" ? "Ativar modo escuro" : "Ativar modo claro" }>
            <IconButton onClick={alternarTema} color="inherit" aria-label="Alternar tema ">
                {modo === "light" ? (
                    <DarkModeOutlined />
                ) : (
                    <LightModeOutlined />
                )}
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggle;