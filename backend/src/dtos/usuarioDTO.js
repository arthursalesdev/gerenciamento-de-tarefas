import AppError from "../errors/AppError.js";

export class CriarUsuarioDTO {
    constructor(dados) {
        if (!dados.nome || typeof dados.nome !== "string" || !dados.nome.trim()) {
            throw new AppError("Nome é obrigatório", 400);
        }

        if (!dados.email || typeof dados.email !== "string" || !dados.email.trim()) {
            throw new AppError("E-mail é obrigatório", 400);
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(dados.email)) {
            throw new AppError("E-mail inválido", 400);
        }

        if (!dados.senha || typeof dados.senha !== "string") {
            throw new AppError("Senha é obrigatória", 400);
        }

        if (dados.senha.length < 6) {
            throw new AppError("Senha deve ter no mínimo 6 caracteres", 400);
        }

        this.nome = dados.nome.trim();
        this.email = dados.email.trim().toLowerCase();
        this.senha = dados.senha;
    }
}

export class LoginUsuarioDTO {
    constructor(dados) {
        if (!dados.email || typeof dados.email !== "string" || !dados.email.trim()) {
            throw new AppError("E-mail é obrigatório", 400);
        }

        if (!dados.senha || typeof dados.senha !== "string") {
            throw new AppError("Senha é obrigatória", 400);
        }

        this.email = dados.email.trim().toLowerCase();
        this.senha = dados.senha;
    }
}

export class UsuarioResponseDTO {
    constructor(usuario) {
        this.id = usuario.id;
        this.nome = usuario.nome;
        this.email = usuario.email;
        this.criadoEm = usuario.criadoEm;
    }
}