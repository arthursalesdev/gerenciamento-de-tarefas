import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";

import AppError from "../errors/AppError.js";
import usuarioRepository from "../repositories/usuarioRepository.js";
import { CriarUsuarioDTO, LoginUsuarioDTO } from "../dtos/usuarioDTO.js";
import UsuarioMapper from "../mappers/usuarioMapper.js";

class AuthService {
    async cadastrar(dados) {
        const dto = new CriarUsuarioDTO(dados);
        const emailExistente = await usuarioRepository.buscarPorEmail(dto.email);
        if (emailExistente) {
            throw new AppError("E-mail já cadastrado", 409);
        }

        const nomeUsuarioExistente = await usuarioRepository.buscarPorNomeUsuario(dto.nomeUsuario);

        if (nomeUsuarioExistente) {
            throw new AppError("Nome de usuário já está em uso", 409);
        }

        const tag = String(randomInt(0, 10000)).padStart(4, "0");

        const senhaHash = await bcrypt.hash(dto.senha, 10);
        let usuario;

        try {
            usuario = await usuarioRepository.criar({
                nome: dto.nome, nomeUsuario: dto.nomeUsuario,
                tag, email: dto.email, senha: senhaHash
            });
        } catch (error) {
            if (error.code === "23505" || error.cause?.code === "23505") {
                throw new AppError("E-mail ou nome de usuário já está em uso", 409);
            }

            throw error;
        }

        return UsuarioMapper.paraResponseDTO(usuario);
    }

    async login(dados) {
        const dto = new LoginUsuarioDTO(dados);
        const usuario = await usuarioRepository.buscarPorIdentificador(dto.identificador);
        if (!usuario) {
            throw new AppError("Usuário ou senha inválidos", 401);
        }

        const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);

        if (!senhaValida) {
            throw new AppError("Usuário ou senha inválidos", 401);
        }

        const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, process.env.JWT_SECRET, { expiresIn: "8h" });

        return {
            token, usuario: UsuarioMapper.paraResponseDTO(usuario)
        };
    }

    async buscarUsuarioLogado(usuarioId) {
        const usuario = await usuarioRepository.buscarPorId(usuarioId);

        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }

        return UsuarioMapper.paraResponseDTO(usuario);
    }
}

export default new AuthService();