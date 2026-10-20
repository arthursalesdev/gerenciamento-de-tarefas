import AppError from "../errors/AppError.js";

export class CriarEquipeDTO {
    constructor({ nome }) {
        if (!nome || nome.trim() === "") {
            throw new AppError("Nome da equipe é obrigatório", 400);
        }

        if (nome.length > 100) {
            throw new AppError("Nome da equipe deve ter no máximo 100 caracteres", 400);
        }

        this.nome = nome.trim();
    }
}

export class EquipeResponseDTO {
    constructor(equipe) {
        this.id = equipe.id;
        this.nome = equipe.nome;
        this.criadorId = equipe.criadorId;
        this.criadoEm = equipe.criadoEm;
        this.atualizadoEm = equipe.atualizadoEm;
    }
}

export class AtualizarEquipeDTO {
    constructor({ nome }) {
        if (nome === undefined) {
            throw new AppError("Nome da equipe é obrigatório", 400);
        }

        if (!nome || nome.trim() === "") {
            throw new AppError("Nome da equipe não pode ser vazio", 400);
        }

        if (nome.length > 100) {
            throw new AppError("Nome da equipe deve ter no máximo 100 caracteres", 400);
        }

        this.nome = nome.trim();
    }
}