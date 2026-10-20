import { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { criarTema } from "../theme/tema";

const TemaContext = createContext();

export function TemaProvider({ children }) {
    const [modo, setModo] = useState(() => {
        return localStorage.getItem("tema") || "light";
    });

    const tema = useMemo(() => criarTema(modo), [modo]);

    const alternarTema = () => {
        setModo((modoAtual) => {
            const novoModo = modoAtual === "light" ? "dark" : "light";
            localStorage.setItem("tema", novoModo);
            return novoModo;
        });
    };

    return (
        <TemaContext.Provider value={{ modo, alternarTema }}>
            <ThemeProvider theme={tema}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </TemaContext.Provider>
    );
}

export function useTema() {
    return useContext(TemaContext);
}