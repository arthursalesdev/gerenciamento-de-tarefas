import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/cadastro", (req, res, next) =>
    authController.cadastrar(req, res, next)
);

router.post("/login", (req, res, next) =>
    authController.login(req, res, next)
);

export default router;