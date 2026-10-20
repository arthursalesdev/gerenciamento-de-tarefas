import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import AppError from "../errors/AppError.js";
import usuarioRepository from "../repositories/usuarioRepository.js";
import { CriarUsuarioDTO, LoginUsuarioDTO } from "../dtos/usuarioDTO.js";
import UsuarioMapper from "../mappers/usuarioMapper.js";

class AuthService {

    async cadastrar(dados) {
        const dto = new CriarUsuarioDTO(dados);
        const usuarioExistente = await usuarioRepository.buscarPorEmail(dto.email);
        if (usuarioExistente) {
            throw new AppError("E-mail já cadastrado", 409);
        }

        const senhaHash = await bcrypt.hash(dto.senha, 10);
        const usuario = await usuarioRepository.criar({ nome: dto.nome, email: dto.email, senha: senhaHash });
        return UsuarioMapper.paraResponseDTO(usuario);
    }

    async login(dados) {
        const dto = new LoginUsuarioDTO(dados);
        const usuario = await usuarioRepository.buscarPorEmail(dto.email);
        if (!usuario) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
        if (!senhaValida) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }
        const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, process.env.JWT_SECRET, { expiresIn: "8h" });
        return { token, usuario: UsuarioMapper.paraResponseDTO(usuario) };
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