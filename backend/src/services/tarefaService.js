import tarefaRepository from "../repositories/tarefaRepository.js";
import logTarefaRepository from "../repositories/logTarefaRepository.js";
import { CriarTarefaDTO, AtualizarTarefaDTO } from "../dtos/tarefaDTO.js";
import TarefaMapper from "../mappers/tarefaMapper.js";
import AppError from "../errors/AppError.js";

class TarefaService {
    async listarTodas(usuarioId) {
        const tarefas = await tarefaRepository.listarTodas(usuarioId);
        return TarefaMapper.paraListaResponseDTO(tarefas);
    }

    async criar(dados, usuarioId) {
        const dto = new CriarTarefaDTO(dados);
        const tarefa = await tarefaRepository.criar({...dto, usuarioId});
        
        await logTarefaRepository.criar({ tarefaId: tarefa.id, usuarioId, acao: "CRIADA", detalhes: "Tarefa criada" });
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
}

export default new TarefaService();