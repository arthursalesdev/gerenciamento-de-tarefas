import equipeRepository from "../repositories/equipeRepository.js";
import membroEquipeRepository from "../repositories/membroEquipeRepository.js";

import { CriarEquipeDTO, AtualizarEquipeDTO } from "../dtos/equipeDTO.js";

import equipeMapper from "../mappers/equipeMapper.js";
import AppError from "../errors/AppError.js";

class EquipeService {
    async listar(usuarioId) {
        const participacoes = await membroEquipeRepository.listarPorUsuario(usuarioId);

        if (participacoes.length === 0) {
            return [];
        }

        const equipes = await equipeRepository.listarPorIds(
            participacoes.map(participacao => participacao.equipeId)
        );

        return equipeMapper.paraListaResponseDTO(equipes);
    }

    async buscarPorId(id, usuarioId) {
        const equipe = await equipeRepository.buscarPorId(id);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, id);

        if (!membro) {
            throw new AppError(
                "Você não possui acesso a esta equipe",
                403
            );
        }

        return equipeMapper.paraResponseDTO(equipe);
    }

    async criar(dados, usuarioId) {
        const dto = new CriarEquipeDTO(dados);

        const equipe = await equipeRepository.criar({
            nome: dto.nome,
            criadorId: usuarioId
        });

        await membroEquipeRepository.adicionar(
            usuarioId,
            equipe.id,
            "DONO"
        );

        return equipeMapper.paraResponseDTO(equipe);
    }

    async atualizar(id, dados, usuarioId) {
        const equipeExistente = await equipeRepository.buscarPorId(id);

        if (!equipeExistente) {
            throw new AppError("Equipe não encontrada", 404);
        }

        // Verifica o cargo atual do usuário na equipe
        const membroExecutor = await membroEquipeRepository.buscar(usuarioId, id);

        if (!membroExecutor || membroExecutor.cargo !== "DONO") {
            throw new AppError(
                "Apenas o DONO pode atualizar esta equipe",
                403
            );
        }

        const dto = new AtualizarEquipeDTO(dados);

        const equipeAtualizada = await equipeRepository.atualizar(id, {
            nome: dto.nome
        });

        return equipeMapper.paraResponseDTO(equipeAtualizada);
    }

    async deletar(id, usuarioId) {
        const equipe = await equipeRepository.buscarPorId(id);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const executor = await membroEquipeRepository.buscar(
            usuarioId,
            id
        );

        if (!executor || executor.cargo !== "DONO") {
            throw new AppError(
                "Apenas o DONO pode excluir esta equipe",
                403
            );
        }

        const membros = await membroEquipeRepository.listarPorEquipe(id);

        if (membros.length > 1) {
            throw new AppError(
                "Remova os outros membros antes de excluir a equipe",
                409
            );
        }

        await equipeRepository.deletar(id);
    }
}

export default new EquipeService();