import { Router } from "express";

import conviteEquipeController from "../controllers/conviteEquipeController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Convites
 *   description: Envio e gerenciamento de convites para equipes
 */

/**
 * @swagger
 * /convites-equipes:
 *   post:
 *     summary: Enviar convite para uma equipe
 *     description: >
 *       O dono ou um líder pode enviar convites. Somente o dono pode
 *       convidar uma pessoa para o cargo de líder.
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipeId
 *               - convidadoId
 *             properties:
 *               equipeId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               convidadoId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               cargo:
 *                 type: string
 *                 enum: [LIDER, MEMBRO, VISUALIZADOR]
 *                 default: MEMBRO
 *                 example: MEMBRO
 *     responses:
 *       201:
 *         description: Convite enviado com sucesso
 *       400:
 *         description: Dados do convite inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Usuário sem permissão para enviar o convite
 *       404:
 *         description: Equipe ou usuário convidado não encontrado
 *       409:
 *         description: Usuário já pertence à equipe ou possui convite pendente
 */
router.post("/", conviteEquipeController.enviar);

/**
 * @swagger
 * /convites-equipes/recebidos:
 *   get:
 *     summary: Listar convites recebidos
 *     description: >
 *       Retorna os convites recebidos pelo usuário autenticado,
 *       incluindo convites de diferentes status.
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de convites recebidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.get("/recebidos", conviteEquipeController.listarRecebidos);

/**
 * @swagger
 * /convites-equipes/equipe/{equipeId}:
 *   get:
 *     summary: Listar convites de uma equipe
 *     description: Somente o dono ou um líder pode consultar os convites da equipe.
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         description: ID da equipe
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Lista de convites da equipe
 *       400:
 *         description: ID da equipe inválido
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Usuário sem permissão para consultar os convites
 */
router.get("/equipe/:equipeId", conviteEquipeController.listarPorEquipe);

/**
 * @swagger
 * /convites-equipes/{conviteId}/aceitar:
 *   patch:
 *     summary: Aceitar convite
 *     description: >
 *       Permite que o destinatário aceite um convite pendente e
 *       passe a fazer parte da equipe.
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conviteId
 *         required: true
 *         description: ID do convite
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Convite aceito com sucesso
 *       400:
 *         description: ID do convite inválido
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: O convite não pertence ao usuário autenticado
 *       404:
 *         description: Convite não encontrado
 *       409:
 *         description: Convite não está pendente ou usuário já pertence à equipe
 */
router.patch("/:conviteId/aceitar", conviteEquipeController.aceitar);

/**
 * @swagger
 * /convites-equipes/{conviteId}/recusar:
 *   patch:
 *     summary: Recusar convite
 *     description: Permite que o destinatário recuse um convite pendente.
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conviteId
 *         required: true
 *         description: ID do convite
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Convite recusado com sucesso
 *       400:
 *         description: ID do convite inválido
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Somente o destinatário pode recusar o convite
 *       404:
 *         description: Convite não encontrado
 *       409:
 *         description: Convite não está mais pendente
 */
router.patch("/:conviteId/recusar", conviteEquipeController.recusar);

/**
 * @swagger
 * /convites-equipes/{conviteId}/cancelar:
 *   patch:
 *     summary: Cancelar convite
 *     description: Permite que o dono ou um líder cancele um convite pendente.
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conviteId
 *         required: true
 *         description: ID do convite
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Convite cancelado com sucesso
 *       400:
 *         description: ID do convite inválido
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Usuário sem permissão para cancelar o convite
 *       404:
 *         description: Convite não encontrado
 *       409:
 *         description: Convite não está mais pendente
 */
router.patch("/:conviteId/cancelar", conviteEquipeController.cancelar);

export default router;