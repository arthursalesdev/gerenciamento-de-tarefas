import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

router.get("/buscar", autenticar, usuarioController.buscar);
router.get("/:id", autenticar, usuarioController.buscarPorId);

export default router;
