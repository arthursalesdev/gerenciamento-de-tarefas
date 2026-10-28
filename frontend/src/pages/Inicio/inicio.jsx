import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import { Navbar } from "../../components/Navbar/navbar";
import HeroLanding from "../../components/Landing/HeroLanding/heroLanding";
import PessoalEquipe from "../../components/Landing/PessoalEquipe/pessoalEquipe";
import Recursos from "../../components/Landing/Recursos/recursos";
import ComoFunciona from "../../components/Landing/ComoFunciona/comoFunciona";
import CtaFinal from "../../components/Landing/CtaFinal/ctaFinal";
import Footer from "../../components/Landing/Footer/footer";
import ModalAuth from "../../components/ModalAuth/modalAuth";
import { useAuth } from "../../context/authContext";

function Inicio() {
    const navigate = useNavigate();
    const { estaLogado } = useAuth();

    const [modalAuthAberto, setModalAuthAberto] = useState(false);
    const [modoAuth, setModoAuth] = useState("login");

    const abrirAutenticacao = (modo) => {
        if (estaLogado) {
            navigate("/tarefas");
            return;
        }

        setModoAuth(modo);
        setModalAuthAberto(true);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
                transition: "background-color 0.2s ease"
            }}
        >
            <Navbar />

            <Box sx={{ height: { xs: 100, md: 110 } }} />

            <HeroLanding aoComecar={() => abrirAutenticacao("cadastro")} />

            <PessoalEquipe />
            <Recursos />
            <ComoFunciona />

            <CtaFinal
                aoComecar={() => abrirAutenticacao("cadastro")}
                aoEntrar={() => abrirAutenticacao("login")}
            />

            <Footer aoEntrar={() => abrirAutenticacao("login")} />

            <ModalAuth
                aberto={modalAuthAberto}
                aoFechar={() => setModalAuthAberto(false)}
                modoInicial={modoAuth}
            />
        </Box>
    );
}

export default Inicio;