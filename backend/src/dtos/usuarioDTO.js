import AppError from "../errors/AppError.js";

export class CriarUsuarioDTO {
    constructor(dados) {
        if (typeof dados?.nome !== "string" || !dados.nome.trim()) {
            throw new AppError("Nome é obrigatório", 400);
        }

        const nome = dados.nome.trim();

        if (nome.length > 100) {
            throw new AppError(
                "Nome deve ter no máximo 100 caracteres",
                400
            );
        }

        if (typeof dados?.nomeUsuario !== "string" || !dados.nomeUsuario.trim()) {
            throw new AppError("Nome de usuário é obrigatório", 400);
        }

        const nomeUsuario = dados.nomeUsuario.trim().toLowerCase();

        if (!/^[a-z0-9_]{3,50}$/.test(nomeUsuario)) {
            throw new AppError(
                "Nome de usuário deve ter de 3 a 50 caracteres, usando apenas letras, números e _",
                400
            );
        }

        if (typeof dados?.email !== "string" || !dados.email.trim()) {
            throw new AppError("E-mail é obrigatório", 400);
        }

        const email = dados.email.trim().toLowerCase();

        if (email.length > 150) {
            throw new AppError(
                "E-mail deve ter no máximo 150 caracteres",
                400
            );
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {
            throw new AppError("E-mail inválido", 400);
        }

        if (typeof dados?.senha !== "string" || !dados.senha) {
            throw new AppError("Senha é obrigatória", 400);
        }

        if (dados.senha.length < 6) {
            throw new AppError("Senha deve ter no mínimo 6 caracteres", 400);
        }

        this.nome = nome;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.senha = dados.senha;
    }
}

export class LoginUsuarioDTO {
    constructor(dados) {
        const identificador = dados?.identificador ?? dados?.email;

        if (typeof identificador !== "string" || !identificador.trim()) {
            throw new AppError("E-mail ou nome de usuário é obrigatório", 400);
        }

        if (typeof dados?.senha !== "string" || !dados.senha) {
            throw new AppError("Senha é obrigatória", 400);
        }

        this.identificador = identificador.trim().toLowerCase();
        this.senha = dados.senha;
    }
}

export class UsuarioResponseDTO {
    constructor(usuario) {
        this.id = usuario.id;
        this.nome = usuario.nome;
        this.nomeUsuario = usuario.nomeUsuario;
        this.tag = usuario.tag;
        this.email = usuario.email;
        this.criadoEm = usuario.criadoEm;
    }
}