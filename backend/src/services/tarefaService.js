import tarefaRepository from "../repositories/tarefaRepository.js";
import logTarefaRepository from "../repositories/logTarefaRepository.js";
import membroEquipeRepository from "../repositories/membroEquipeRepository.js";
import { CriarTarefaDTO, AtualizarTarefaDTO } from "../dtos/tarefaDTO.js";
import TarefaMapper from "../mappers/tarefaMapper.js";
import AppError from "../errors/AppError.js";

class TarefaService {
    async listarTodas(usuarioId) {
        const tarefas = await tarefaRepository.listarTodas(usuarioId);
        return TarefaMapper.paraListaResponseDTO(tarefas);
    }

    async listarPorEquipe(equipeId, usuarioId) {
        // Valida o identificador da equipe
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        // Verifica se o usuário pertence à equipe
        const membro = await membroEquipeRepository.buscar(
            usuarioId,
            equipeId
        );

        if (!membro) {
            throw new AppError(
                "Você não possui acesso a esta equipe",
                403
            );
        }

        // Busca as tarefas compartilhadas da equipe
        const tarefas = await tarefaRepository.listarPorEquipe(equipeId);

        return TarefaMapper.paraListaResponseDTO(tarefas);
    }

    async buscarPorIdNaEquipe(tarefaId, equipeId, usuarioId) {
        // Valida os identificadores
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isInteger(tarefaId) || tarefaId <= 0) {
            throw new AppError("ID da tarefa inválido", 400);
        }

        // Verifica se o usuário pertence à equipe
        const membro = await membroEquipeRepository.buscar(
            usuarioId,
            equipeId
        );

        if (!membro) {
            throw new AppError(
                "Você não possui acesso a esta equipe",
                403
            );
        }

        // Busca a tarefa exclusivamente na equipe informada
        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(
            tarefaId,
            equipeId
        );

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        return TarefaMapper.paraResponseDTO(tarefa);
    }

    async atualizarNaEquipe(tarefaId, equipeId, dados, usuarioId) {
        // Valida os identificadores
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isInteger(tarefaId) || tarefaId <= 0) {
            throw new AppError("ID da tarefa inválido", 400);
        }

        // Verifica se o usuário pertence à equipe
        const membro = await membroEquipeRepository.buscar(
            usuarioId,
            equipeId
        );

        if (!membro) {
            throw new AppError(
                "Você não possui acesso a esta equipe",
                403
            );
        }

        // Busca a tarefa na equipe informada
        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(
            tarefaId,
            equipeId
        );

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        // VISUALIZADOR não pode atualizar tarefas
        if (membro.cargo === "VISUALIZADOR") {
            throw new AppError(
                "Você não possui permissão para atualizar tarefas nesta equipe",
                403
            );
        }

        // MEMBRO só pode atualizar tarefas criadas ou atribuídas a ele
        if (
            membro.cargo === "MEMBRO" &&
            tarefa.usuarioId !== usuarioId &&
            tarefa.responsavelId !== usuarioId
        ) {
            throw new AppError(
                "Você não possui permissão para atualizar esta tarefa",
                403
            );
        }

        // Valida os campos permitidos para atualização
        const dto = new AtualizarTarefaDTO(dados);

        // Atualiza a tarefa
        const tarefaAtualizada = await tarefaRepository.atualizarNaEquipe(
            tarefaId,
            equipeId,
            dto
        );

        if (!tarefaAtualizada) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        // Registra a atualização no histórico
        await logTarefaRepository.criar({
            tarefaId,
            usuarioId,
            acao: "ATUALIZADA",
            detalhes: "Tarefa de equipe atualizada"
        });

        return TarefaMapper.paraResponseDTO(tarefaAtualizada);
    }

    async criar(dados, usuarioId) {
        const dto = new CriarTarefaDTO(dados);

        // Tarefa individual: mantém o comportamento existente
        if (dto.equipeId === null) {
            const tarefa = await tarefaRepository.criar({
                ...dto,
                usuarioId
            });

            await logTarefaRepository.criar({
                tarefaId: tarefa.id,
                usuarioId,
                acao: "CRIADA",
                detalhes: "Tarefa individual criada"
            });

            return TarefaMapper.paraResponseDTO(tarefa);
        }

        // Verifica se o criador pertence à equipe
        const membroCriador = await membroEquipeRepository.buscar(
            usuarioId,
            dto.equipeId
        );

        if (!membroCriador) {
            throw new AppError(
                "Você não pertence a esta equipe",
                403
            );
        }

        // VISUALIZADOR não pode criar tarefas
        if (membroCriador.cargo === "VISUALIZADOR") {
            throw new AppError(
                "Você não possui permissão para criar tarefas nesta equipe",
                403
            );
        }

        // Verifica o responsável informado
        if (dto.responsavelId !== null) {
            const membroResponsavel = await membroEquipeRepository.buscar(
                dto.responsavelId,
                dto.equipeId
            );

            if (!membroResponsavel) {
                throw new AppError(
                    "O responsável deve pertencer à equipe",
                    400
                );
            }

            // MEMBRO só pode atribuir tarefas a si mesmo
            if (
                membroCriador.cargo === "MEMBRO" &&
                dto.responsavelId !== usuarioId
            ) {
                throw new AppError("MEMBRO só pode atribuir tarefas a si mesmo", 403);
            }
        }

        const tarefa = await tarefaRepository.criar({ ...dto, usuarioId });
        await logTarefaRepository.criar({ tarefaId: tarefa.id, usuarioId, acao: "CRIADA", detalhes: "Tarefa de equipe criada" });

        return TarefaMapper.paraResponseDTO(tarefa);
    }

    async buscarPorId(id, usuarioId) {
        const tarefa = await tarefaRepository.buscarPorId(id, usuarioId);
        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        return TarefaMapper.paraResponseDTO(tarefa);
    }

    async atualizar(id, dados, usuarioId) {
        const tarefaExistente = await tarefaRepository.buscarPorId(id, usuarioId);
        if (!tarefaExistente) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        const dto = new AtualizarTarefaDTO(dados);
        const tarefaAtualizada = await tarefaRepository.atualizar(id, usuarioId, dto);

        await logTarefaRepository.criar({ tarefaId: id, usuarioId, acao: "ATUALIZADA", detalhes: "Tarefa atualizada" });
        return TarefaMapper.paraResponseDTO(tarefaAtualizada);
    }

    async deletar(id, usuarioId) {
        const tarefa = await tarefaRepository.buscarPorId(id, usuarioId);
        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        await logTarefaRepository.criar({ tarefaId: id, usuarioId, acao: "EXCLUIDA", detalhes: "Tarefa excluída" });
        await tarefaRepository.deletar(id, usuarioId);
    }

    async deletarNaEquipe(tarefaId, equipeId, usuarioId) {
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isInteger(tarefaId) || tarefaId <= 0) {
            throw new AppError("ID da tarefa inválido", 400);
        }

        const membro = await membroEquipeRepository.buscar(
            usuarioId,
            equipeId
        );

        if (!membro) {
            throw new AppError(
                "Você não possui acesso a esta equipe",
                403
            );
        }

        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(
            tarefaId,
            equipeId
        );

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        if (membro.cargo === "VISUALIZADOR") {
            throw new AppError(
                "Você não possui permissão para excluir tarefas nesta equipe",
                403
            );
        }

        if (
            membro.cargo === "MEMBRO" &&
            tarefa.usuarioId !== usuarioId
        ) {
            throw new AppError(
                "Você não possui permissão para excluir esta tarefa",
                403
            );
        }

        const tarefaExcluida = await tarefaRepository.deletarNaEquipe(
            tarefaId,
            equipeId
        );

        if (!tarefaExcluida) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        await logTarefaRepository.criar({
            tarefaId,
            usuarioId,
            acao: "EXCLUIDA",
            detalhes: "Tarefa de equipe excluída"
        });
    }
}

export default new TarefaService();