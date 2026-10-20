import AppError from "../errors/AppError.js";

export class AdicionarMembroDTO {
    constructor({ usuarioId }) {
        if (!usuarioId) {
            throw new AppError("Usuário é obrigatório", 400);
        }

        if (!Number.isInteger(Number(usuarioId))) {
            throw new AppError("Usuário inválido", 400);
        }

        this.usuarioId = Number(usuarioId);
    }
}

export class AlterarCargoMembroDTO {
    constructor({ cargo }) {
        const cargosValidos = [
            "DONO", "LIDER", "MEMBRO", "VISUALIZADOR"
        ];

        if (!cargo) {
            throw new AppError("Cargo é obrigatório", 400);
        }

        if (!cargosValidos.includes(cargo)) {
            throw new AppError("Cargo inválido", 400);
        }

        this.cargo = cargo;
    }
}

export class MembroEquipeResponseDTO {
    constructor(membro) {
        this.id = membro.id;
        this.usuarioId = membro.usuarioId;
        this.equipeId = membro.equipeId;
        this.cargo = membro.cargo;
        this.criadoEm = membro.criadoEm;
    }
}