import { Router } from "express";
import conviteEquipeController from "../controllers/conviteEquipeController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

router.use(autenticar);

router.post("/", conviteEquipeController.enviar);

router.get("/recebidos", conviteEquipeController.listarRecebidos);

router.get("/equipe/:equipeId", conviteEquipeController.listarPorEquipe);

router.patch("/:conviteId/aceitar", conviteEquipeController.aceitar);

router.patch("/:conviteId/recusar", conviteEquipeController.recusar);

router.patch("/:conviteId/cancelar", conviteEquipeController.cancelar);

export default router;
