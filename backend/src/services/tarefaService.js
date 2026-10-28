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
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!membro) {
            throw new AppError("Você não possui acesso a esta equipe", 403);
        }

        const tarefas = await tarefaRepository.listarPorEquipe(equipeId);
        return TarefaMapper.paraListaResponseDTO(tarefas);
    }

    async buscarPorIdNaEquipe(tarefaId, equipeId, usuarioId) {
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isInteger(tarefaId) || tarefaId <= 0) {
            throw new AppError("ID da tarefa inválido", 400);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!membro) {
            throw new AppError("Você não possui acesso a esta equipe", 403);
        }

        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(tarefaId, equipeId);

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        return TarefaMapper.paraResponseDTO(tarefa);
    }

    async atualizarNaEquipe(tarefaId, equipeId, dados, usuarioId) {
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isInteger(tarefaId) || tarefaId <= 0) {
            throw new AppError("ID da tarefa inválido", 400);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!membro) {
            throw new AppError("Você não possui acesso a esta equipe", 403);
        }

        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(tarefaId, equipeId);

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        if (!["DONO", "LIDER", "MEMBRO"].includes(membro.cargo)) {
            throw new AppError("Você não possui permissão para atualizar tarefas nesta equipe", 403);
        }

        if (membro.cargo === "MEMBRO" && String(tarefa.responsavelId) !== String(usuarioId)) {
            throw new AppError("Você só pode editar tarefas atribuídas a você", 403);
        }

        const dto = new AtualizarTarefaDTO(dados);

        const tarefaAtualizada = await tarefaRepository.atualizarNaEquipe(tarefaId, equipeId, dto);

        if (!tarefaAtualizada) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        await logTarefaRepository.criar({
            tarefaId, usuarioId, acao: "ATUALIZADA", detalhes: "Tarefa de equipe atualizada"
        });

        return TarefaMapper.paraResponseDTO(tarefaAtualizada);
    }

    async criar(dados, usuarioId) {
        const dto = new CriarTarefaDTO(dados);

        if (dto.equipeId === null) {
            const tarefa = await tarefaRepository.criar({
                ...dto, usuarioId, responsavelId: usuarioId
            });

            await logTarefaRepository.criar({
                tarefaId: tarefa.id, usuarioId, acao: "CRIADA", detalhes: "Tarefa individual criada"
            });

            return TarefaMapper.paraResponseDTO(tarefa);
        }

        const membroCriador = await membroEquipeRepository.buscar(usuarioId, dto.equipeId);

        if (!membroCriador) {
            throw new AppError("Você não pertence a esta equipe", 403);
        }

        if (membroCriador.cargo === "VISUALIZADOR") {
            throw new AppError("Você não possui permissão para criar tarefas nesta equipe", 403);
        }

        if (dto.responsavelId !== null) {
            if (!["DONO", "LIDER"].includes(membroCriador.cargo)) {
                throw new AppError("Somente DONO ou LIDER podem atribuir responsáveis", 403);
            }

            const membroResponsavel = await membroEquipeRepository.buscar(dto.responsavelId, dto.equipeId);

            if (!membroResponsavel) {
                throw new AppError("O responsável deve pertencer à equipe", 400);
            }
        }

        const tarefa = await tarefaRepository.criar({
            ...dto, usuarioId
        });

        await logTarefaRepository.criar({
            tarefaId: tarefa.id, usuarioId, acao: "CRIADA", detalhes: "Tarefa de equipe criada"
        });

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

    async atualizarResponsavel(tarefaId, equipeId, dados, usuarioId) {
        if (!Number.isInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isInteger(tarefaId) || tarefaId <= 0) {
            throw new AppError("ID da tarefa inválido", 400);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!membro) {
            throw new AppError("Você não possui acesso a esta equipe", 403);
        }

        if (!["DONO", "LIDER"].includes(membro.cargo)) {
            throw new AppError("Somente DONO ou LIDER podem alterar responsáveis", 403);
        }

        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(tarefaId, equipeId);

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        if (!dados || typeof dados !== "object" || Array.isArray(dados) || !Object.prototype.hasOwnProperty.call(dados, "responsavelId")) {
            throw new AppError("Informe o campo responsavelId", 400);
        }

        const { responsavelId } = dados;

        if (responsavelId !== null && (!Number.isInteger(responsavelId) || responsavelId <= 0)) {
            throw new AppError("ID do responsável inválido", 400);
        }

        if (responsavelId !== null) {
            const membroResponsavel = await membroEquipeRepository.buscar(responsavelId, equipeId);

            if (!membroResponsavel) {
                throw new AppError("O responsável deve pertencer à equipe", 400);
            }
        }

        const tarefaAtualizada = await tarefaRepository.atualizarNaEquipe(tarefaId, equipeId, { responsavelId });

        if (!tarefaAtualizada) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        await logTarefaRepository.criar({
            tarefaId, usuarioId, acao: "ATUALIZADA", detalhes: "Responsável da tarefa de equipe atualizado"
        });

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

        const membro = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!membro) {
            throw new AppError("Você não possui acesso a esta equipe", 403);
        }

        const tarefa = await tarefaRepository.buscarPorIdNaEquipe(tarefaId, equipeId);

        if (!tarefa) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        if (!["DONO", "LIDER"].includes(membro.cargo)) {
            throw new AppError("Somente DONO ou LIDER podem excluir tarefas da equipe", 403);
        }

        const tarefaExcluida = await tarefaRepository.deletarNaEquipe(tarefaId, equipeId);

        if (!tarefaExcluida) {
            throw new AppError("Tarefa não encontrada", 404);
        }

        await logTarefaRepository.criar({
            tarefaId, usuarioId, acao: "EXCLUIDA", detalhes: "Tarefa de equipe excluída"
        });
    }

}

export default new TarefaService();