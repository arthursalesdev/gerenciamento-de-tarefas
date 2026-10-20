import { Router } from "express";

import { autenticar } from "../middlewares/autenticar.js";
import membroEquipeController from "../controllers/membroEquipeController.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Membros
 *   description: Rotas de gerenciamento de membros de equipes
 */

/**
 * @swagger
 * /equipes/{equipeId}/membros:
 *   get:
 *     summary: Listar membros da equipe
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da equipe
 *     responses:
 *       200:
 *         description: Lista de membros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembroEquipe'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário não pertence à equipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Equipe não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/:equipeId/membros", autenticar, membroEquipeController.listar);

/**
 * @swagger
 * /equipes/{equipeId}/membros:
 *   post:
 *     summary: Adicionar membro à equipe
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da equipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdicionarMembro'
 *     responses:
 *       201:
 *         description: Membro adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembroEquipe'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário sem permissão para adicionar membros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Equipe ou usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: Usuário já pertence à equipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/:equipeId/membros", autenticar, membroEquipeController.adicionar);

/**
 * @swagger
 * /equipes/{equipeId}/membros/me:
 *   delete:
 *     summary: Sair voluntariamente de uma equipe
 *     description: >
 *       Permite que o usuário autenticado saia de uma equipe
 *       da qual participa. O DONO não pode abandonar a equipe
 *       enquanto for o proprietário; antes, deve transferir
 *       a propriedade para outro membro.
 *     tags: [Membros]
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
 *       204:
 *         description: Usuário saiu da equipe com sucesso
 *       400:
 *         description: Saída não permitida pelas regras da equipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário sem permissão para realizar a operação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Equipe não encontrada ou usuário não pertence à equipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete("/:equipeId/membros/me", autenticar, membroEquipeController.sairDaEquipe);

/**
 * @swagger
 * /equipes/{equipeId}/membros/{usuarioId}:
 *   delete:
 *     summary: Remover membro da equipe
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da equipe
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do usuário que será removido da equipe
 *     responses:
 *       204:
 *         description: Membro removido com sucesso
 *       400:
 *         description: O responsável pela equipe não pode remover a si mesmo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário sem permissão para remover membros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Equipe não encontrada ou usuário não pertence à equipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete("/:equipeId/membros/:usuarioId", autenticar, membroEquipeController.remover);

/**
 * @swagger
 * /equipes/{equipeId}/membros/{usuarioId}/cargo:
 *   patch:
 *     summary: Alterar cargo de um membro da equipe
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da equipe
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário que terá o cargo alterado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlterarCargoMembro'
 *     responses:
 *       200:
 *         description: Cargo alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembroEquipe'
 *       400:
 *         description: Alteração de cargo inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário sem permissão para alterar o cargo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Equipe ou membro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.patch("/:equipeId/membros/:usuarioId/cargo", autenticar, membroEquipeController.alterarCargo);

/**
 * @swagger
 * /equipes/{equipeId}/propriedade:
 *   patch:
 *     summary: Transferir a propriedade de uma equipe
 *     description: Apenas o DONO atual pode transferir a propriedade para outro membro da equipe. O antigo DONO passa a LIDER.
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novoDonoId
 *             properties:
 *               novoDonoId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Propriedade transferida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembroEquipe'

 *       400:
 *         description: Dados inválidos ou transferência para si mesmo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário não é o DONO da equipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Equipe ou destinatário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: Conflito durante a transferência
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.patch("/:equipeId/propriedade", autenticar, membroEquipeController.transferirPropriedade);

export default router;