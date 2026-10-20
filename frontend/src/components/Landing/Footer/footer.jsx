import {
    Box,
    Container,
    Link,
    Stack,
    Typography
} from "@mui/material";

function Footer() {
    const anoAtual = new Date().getFullYear();

    const links = [
        {
            nome: "Recursos",
            href: "#recursos"
        },
        {
            nome: "Como funciona",
            href: "#como-funciona"
        },
        {
            nome: "Entrar",
            href: "#"
        }
    ];

    return (
        <Box
            component="footer"
            sx={{
                mt: {
                    xs: 2,
                    md: 3
                },
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider"
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        maxWidth: 1000,
                        mx: "auto",

                        pt: {
                            xs: 3,
                            md: 3.5
                        },

                        pb: {
                            xs: 2,
                            md: 2.5
                        }
                    }}
                >
                    {/* CONTEÚDO PRINCIPAL */}
                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1.4fr 1fr"
                            },

                            gap: {
                                xs: 4,
                                md: 8
                            },

                            alignItems: "start"
                        }}
                    >
                        {/* IDENTIDADE */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "1.25rem",
                                    fontWeight: 700,
                                    lineHeight: 1.2
                                }}
                            >
                                Task
                                <Box
                                    component="span"
                                    sx={{
                                        color: "primary.main"
                                    }}
                                >
                                    Flow
                                </Box>
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.7,
                                    maxWidth: 390,
                                    lineHeight: 1.3
                                }}
                            >
                                Um espaço simples para organizar suas tarefas
                                e trabalhar melhor em equipe.
                            </Typography>
                        </Box>

                        {/* NAVEGAÇÃO */}
                        <Box
                            sx={{
                                justifySelf: {
                                    xs: "start",
                                    md: "end"
                                }
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mb: 1.4,
                                    color: "text.primary",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em"
                                }}
                            >
                                Navegação
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={{
                                    xs: 2.5,
                                    sm: 3.5
                                }}
                                flexWrap="wrap"
                                useFlexGap
                            >
                                {links.map((link) => (
                                    <Link
                                        key={link.nome}
                                        href={link.href}
                                        underline="none"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: "0.85rem",
                                            fontWeight: 500,
                                            transition: "color 0.2s ease",

                                            "&:hover": {
                                                color: "primary.main"
                                            }
                                        }}
                                    >
                                        {link.nome}
                                    </Link>
                                ))}
                            </Stack>
                        </Box>
                    </Box>

                    {/* BASE */}
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center"
                        }}
                        spacing={1}
                        sx={{
                            mt: {
                                xs: 3,
                                md: 3
                            },

                            pt: 1.8,

                            borderTop: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            © {anoAtual} TaskFlow. Todos os direitos reservados.
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "primary.main",
                                fontWeight: 600
                            }}
                        >
                            Organização simples. Trabalho mais claro.
                        </Typography>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;