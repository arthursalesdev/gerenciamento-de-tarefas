import { Router } from "express";

import usuarioController from "../controllers/usuarioController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Consulta de usuários do sistema
 */

/**
 * @swagger
 * /usuarios/buscar:
 *   get:
 *     summary: Buscar usuário pelo nome de usuário e tag
 *     description: >
 *       Retorna os dados públicos de um usuário a partir do nome de
 *       usuário e da tag de quatro dígitos.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nomeUsuario
 *         required: true
 *         description: Nome de usuário cadastrado
 *         schema:
 *           type: string
 *           example: arthur
 *       - in: query
 *         name: tag
 *         required: true
 *         description: Tag do usuário com quatro dígitos, sem o símbolo #
 *         schema:
 *           type: string
 *           pattern: '^\d{4}$'
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       400:
 *         description: Nome de usuário ou tag inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/buscar", autenticar, usuarioController.buscar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Buscar usuário pelo ID
 *     description: >
 *       Retorna os dados públicos do próprio usuário autenticado ou de
 *       outro usuário que compartilhe uma equipe com ele.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       400:
 *         description: ID do usuário inválido
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Usuário autenticado não possui acesso ao usuário consultado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", autenticar, usuarioController.buscarPorId);

export default router;