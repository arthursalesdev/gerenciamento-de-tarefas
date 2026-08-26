import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";

import tarefaController from "../controllers/tarefaController.js";

const router = Router();
router.get("/", autenticar, tarefaController.listarTodas);
router.get("/:id", autenticar, tarefaController.buscarPorId);
router.post("/", autenticar, tarefaController.criar);
router.put("/:id", autenticar, tarefaController.atualizar);
router.delete("/:id", autenticar, tarefaController.deletar);

export default router;