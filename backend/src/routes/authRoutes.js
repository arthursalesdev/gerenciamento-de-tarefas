import { Router } from "express";
import authController from "../controllers/authController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cadastro / Auth
 *   description: Rotas de cadastro e autenticação de usuários
 */

/**
 * @swagger
 * /auth/cadastro:
 *   post:
 *     summary: Cadastrar usuário
 *     tags: [Cadastro / Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - nomeUsuario
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 1
 *                 example: Arthur
 *               nomeUsuario:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 pattern: '^[a-z0-9_]{3,50}$'
 *                 description: Nome de usuário com letras, números ou sublinhado.
 *                 example: arthur
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arthur@teste.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: E-mail ou nome de usuário já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/cadastro", authController.cadastrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar login
 *     description: Aceita e-mail ou nome de usuário como identificador.
 *     tags: [Cadastro / Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identificador
 *               - senha
 *             properties:
 *               identificador:
 *                 type: string
 *                 description: E-mail ou nome de usuário cadastrado.
 *                 example: arthur
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Usuário ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Buscar usuário autenticado
 *     description: Retorna os dados atuais do usuário identificado pelo token JWT.
 *     tags: [Cadastro / Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token não informado, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/me", autenticar, authController.me);

export default router;