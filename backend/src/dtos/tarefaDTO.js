import AppError from "../errors/AppError.js";

export class CriarTarefaDTO {
    constructor(dados) {
        if (!dados.titulo || !dados.titulo.trim()) {
            throw new AppError("Título é obrigatório", 400);
        }

        if (dados.titulo.trim().length > 150) {
            throw new AppError("Título deve ter no máximo 150 caracteres", 400);
        }

        const prioridadesPermitidas = [ "BAIXA", "MEDIA", "ALTA" ];

        if (dados.prioridade && !prioridadesPermitidas.includes(dados.prioridade)) {
            throw new AppError("Prioridade deve ser BAIXA, MEDIA ou ALTA", 400);
        }

        if (dados.dataLimite) {
            const data = new Date(dados.dataLimite);
            if (isNaN(data.getTime())) {
                throw new AppError("Data limite inválida", 400);
            }
            this.dataLimite = data;
        }

        this.titulo = dados.titulo.trim();
        this.descricao = dados.descricao?.trim();
        this.prioridade = dados.prioridade;
    }
}

export class AtualizarTarefaDTO {
    constructor(dados) {
        if (dados.titulo !== undefined) {
            if (typeof dados.titulo !== "string" || !dados.titulo.trim()) {
                throw new AppError("Título não pode ser vazio", 400);
            }

            if (dados.titulo.trim().length > 150) {
                throw new AppError("Título deve ter no máximo 150 caracteres", 400);
            }

            this.titulo = dados.titulo.trim();
        }

        if (dados.descricao !== undefined) {
            this.descricao = dados.descricao?.trim();
        }

        if (dados.status !== undefined) {
            const statusPermitidos = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"];
            if (!statusPermitidos.includes(dados.status)) {
                throw new AppError("Status deve ser PENDENTE, EM_ANDAMENTO ou CONCLUIDA", 400);
            }
            this.status = dados.status;
        }

        if (dados.prioridade !== undefined) {
            const prioridadesPermitidas = ["BAIXA", "MEDIA", "ALTA"];
            if (!prioridadesPermitidas.includes(dados.prioridade)) {
                throw new AppError("Prioridade deve ser BAIXA, MEDIA ou ALTA", 400);
            }
            this.prioridade = dados.prioridade;
        }

        if (dados.dataLimite !== undefined) {
            if (dados.dataLimite === null) {
                this.dataLimite = null;
            } else {
                const data = new Date(dados.dataLimite);
                if (isNaN(data.getTime())) {
                    throw new AppError("Data limite inválida", 400);
                }
                this.dataLimite = data;
            }
        }
    }
}

export class TarefaResponseDTO {
    constructor(tarefa) {
        this.id = tarefa.id;
        this.titulo = tarefa.titulo;
        this.descricao = tarefa.descricao;
        this.status = tarefa.status;
        this.prioridade = tarefa.prioridade;
        this.dataLimite = tarefa.dataLimite;
        this.criadoEm = tarefa.criadoEm;
        this.atualizadoEm = tarefa.atualizadoEm;
    }
}