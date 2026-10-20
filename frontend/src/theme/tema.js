import { createTheme } from "@mui/material/styles";

export function criarTema(modo) {
    const modoClaro = modo === "light";

    return createTheme({
        palette: {
            mode: modo,

            primary: {
                main: modoClaro ? "#C9783E" : "#D98A4E"
            },

            background: {
                default: modoClaro ? "#F1EFEA" : "#181A1F",
                paper: modoClaro ? "#FAF9F6" : "#23262D"
            },

            text: {
                primary: modoClaro ? "#2B2A28" : "#F1F1EF",
                secondary: modoClaro ? "#75716B" : "#A6A7AB"
            },

            divider: modoClaro ? "#D8D3CB" : "#343840",

            warning: {
                main: modoClaro ? "#C9783E" : "#D98A4E"
            },

            info: {
                main: "#7697B8"
            },

            success: {
                main: "#79A58B"
            },

            error: {
                main: "#C96B68"
            }
        },

        shape: {
            borderRadius: 10
        },

        typography: {
            fontFamily: '"DM Sans", "Arial", sans-serif',

            h4: {
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                letterSpacing: "-0.03em"
            },

            h5: {
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                letterSpacing: "-0.02em"
            },

            h6: {
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                letterSpacing: "-0.02em"
            },

            subtitle1: {
                fontWeight: 600
            },

            body1: {
                fontWeight: 400
            },

            body2: {
                fontWeight: 400
            },

            button: {
                textTransform: "none",
                fontWeight: 600
            }
        },

        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none"
                    }
                }
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        backgroundImage: "none"
                    }
                }
            },

            MuiTextField: {
                defaultProps: {
                    size: "small"
                }
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        fontWeight: 600
                    }
                }
            }
        }
    });
}