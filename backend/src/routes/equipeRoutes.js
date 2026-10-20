import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import equipeController from "../controllers/equipeController.js";
import tarefaController from "../controllers/tarefaController.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Equipes
 *   description: Rotas de gerenciamento de equipes
 */

/**
 * @swagger
 * /equipes:
 *   get:
 *     summary: Listar equipes
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipe'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/", autenticar, equipeController.listar);

/**
 * @swagger
 * /equipes/{id}:
 *   get:
 *     summary: Buscar equipe por ID
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da equipe
 *     responses:
 *       200:
 *         description: Equipe encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipe'
 *       401:
 *         description: Token não informado, inválido ou expirado
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
router.get("/:id", autenticar, equipeController.buscarPorId);

/**
 * @swagger
 * /equipes/{equipeId}/tarefas:
 *   get:
 *     summary: Listar tarefas de uma equipe
 *     tags: [Tarefas]
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
 *         description: Lista de tarefas da equipe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: ID da equipe inválido
 *       401:
 *         description: Token não informado ou inválido
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
router.get("/:equipeId/tarefas", autenticar, tarefaController.listarPorEquipe);

/**
 * @swagger
 * /equipes/{equipeId}/tarefas/{tarefaId}:
 *   get:
 *     summary: Buscar tarefa específica de uma equipe
 *     tags: [Tarefas]
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
 *         name: tarefaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: ID da equipe ou da tarefa inválido
 *       401:
 *         description: Token não informado, inválido ou expirado
 *       403:
 *         description: Usuário não pertence à equipe
 *       404:
 *         description: Tarefa não encontrada na equipe
 */
router.get("/:equipeId/tarefas/:tarefaId", autenticar, tarefaController.buscarPorIdNaEquipe);

/**
 * @swagger
 * /equipes/{equipeId}/tarefas/{tarefaId}:
 *   put:
 *     summary: Atualizar tarefa de uma equipe
 *     description: >
 *       Atualiza uma tarefa compartilhada.
 *       O usuário precisa pertencer à equipe e possuir permissão para modificar a tarefa. Usuários com cargo VISUALIZADOR
 *       não podem realizar alterações. Membros podem estar sujeitos a restrições relacionadas à autoria ou atribuição da tarefa.
 *     tags: [Tarefas]
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
 *         name: tarefaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarTarefa'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Dados ou identificadores inválidos
 *       401:
 *         description: Token não informado, inválido ou expirado
 *       403:
 *         description: Usuário sem permissão para atualizar a tarefa
 *       404:
 *         description: Tarefa não encontrada na equipe
 */
router.put("/:equipeId/tarefas/:tarefaId", autenticar, tarefaController.atualizarNaEquipe);

/**
 * @swagger
 * /equipes:
 *   post:
 *     summary: Criar nova equipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarEquipe'
 *     responses:
 *       201:
 *         description: Equipe criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipe'
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
 */
router.post("/", autenticar, equipeController.criar);

/**
 * @swagger
 * /equipes/{id}:
 *   put:
 *     summary: Atualizar equipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             $ref: '#/components/schemas/AtualizarEquipe'
 *     responses:
 *       200:
 *         description: Equipe atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipe'
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
 *         description: Usuário sem permissão para atualizar a equipe
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
router.put("/:id", autenticar, equipeController.atualizar);

/**
 * @swagger
 * /equipes/{id}:
 *   delete:
 *     summary: Excluir equipe
 *     description: >
 *       Apenas o DONO pode excluir a equipe.
 *       A exclusão é permitida somente quando não existem outros membros.
 *       As tarefas vinculadas à equipe e seus respectivos logs são excluídos automaticamente do banco de dados.
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da equipe
 *     responses:
 *       204:
 *         description: Equipe excluída com sucesso
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       403:
 *         description: Usuário sem permissão para excluir a equipe
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
router.delete("/:id", autenticar, equipeController.deletar);

/**
 * @swagger
 * /equipes/{equipeId}/tarefas/{tarefaId}:
 *   delete:
 *     summary: Excluir tarefa de uma equipe
 *     description: >
 *       Realiza a exclusão lógica de uma tarefa compartilhada.
 *       O usuário deve pertencer à equipe e possuir permissão para excluir a tarefa. Usuários com cargo VISUALIZADOR não podem realizar exclusões.
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: path
 *         name: tarefaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Tarefa excluída com sucesso
 *       400:
 *         description: Identificadores inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Tarefa não encontrada
 */
router.delete("/:equipeId/tarefas/:tarefaId", autenticar, tarefaController.deletarNaEquipe);

export default router;