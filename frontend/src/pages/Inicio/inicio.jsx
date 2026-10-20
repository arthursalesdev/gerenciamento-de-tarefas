import { Box } from "@mui/material";

import { Navbar } from "../../components/Navbar/navbar";
import HeroLanding from "../../components/Landing/HeroLanding/heroLanding";
import PessoalEquipe from "../../components/Landing/PessoalEquipe/pessoalEquipe";
import Recursos from "../../components/Landing/Recursos/recursos";
import ComoFunciona from "../../components/Landing/ComoFunciona/comoFunciona";
import CtaFinal from "../../components/Landing/CtaFinal/ctaFinal";
import Footer from "../../components/Landing/Footer/footer";

function Inicio() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary", transition: "background-color 0.2s ease" }} >
            <Navbar />

            <Box sx={{ height: { xs: 100, md: 110 } }} />

            <HeroLanding />
            <PessoalEquipe />
            <Recursos />
            <ComoFunciona />
            <CtaFinal />
            <Footer />
        </Box>
    );
}

export default Inicio;