import AppError from "../errors/AppError.js";

export class AdicionarMembroDTO {
    constructor({ usuarioId }) {
        if (
            usuarioId === undefined ||
            usuarioId === null ||
            usuarioId === ""
        ) {
            throw new AppError("Usuário é obrigatório", 400);
        }

        const id = Number(usuarioId);

        if (
            typeof usuarioId === "boolean" ||
            typeof usuarioId === "object" ||
            (typeof usuarioId !== "number" && typeof usuarioId !== "string") ||
            (typeof usuarioId === "string" && !usuarioId.trim()) ||
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            id > 2147483647
        ) {
            throw new AppError("Usuário inválido", 400);
        }

        this.usuarioId = id;
    }
}

export class AlterarCargoMembroDTO {
    constructor({ cargo }) {
        const cargosValidos = [
            "DONO",
            "LIDER",
            "MEMBRO",
            "VISUALIZADOR"
        ];

        if (!cargo) {
            throw new AppError("Cargo é obrigatório", 400);
        }

        if (typeof cargo !== "string" || !cargosValidos.includes(cargo)) {
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