import membroEquipeRepository from "../repositories/membroEquipeRepository.js";
import equipeRepository from "../repositories/equipeRepository.js";
import usuarioRepository from "../repositories/usuarioRepository.js";

import { AdicionarMembroDTO, AlterarCargoMembroDTO } from "../dtos/membroEquipeDTO.js";
import membroEquipeMapper from "../mappers/membroEquipeMapper.js";

import AppError from "../errors/AppError.js";

class MembroEquipeService {
    async listar(equipeId, usuarioLogadoId) {
        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const usuarioEhMembro = await membroEquipeRepository.buscar(usuarioLogadoId, equipeId);

        if (!usuarioEhMembro) {
            throw new AppError("Você não possui acesso a esta equipe", 403);
        }

        const membros = await membroEquipeRepository.listarPorEquipe(equipeId);

        return membroEquipeMapper.paraListaResponseDTO(membros);
    }

    async adicionar(equipeId, dados, usuarioLogadoId) {
        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const executor = await membroEquipeRepository.buscar(usuarioLogadoId, equipeId);

        if (!executor || (executor.cargo !== "DONO" && executor.cargo !== "LIDER")) {
            throw new AppError("Você não possui permissão para adicionar membros", 403);
        }

        const dto = new AdicionarMembroDTO(dados);
        const usuario = await usuarioRepository.buscarPorId(dto.usuarioId);

        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }

        const membroExistente = await membroEquipeRepository.buscar(dto.usuarioId, equipeId);

        if (membroExistente) {
            throw new AppError("Usuário já pertence a esta equipe", 409);
        }

        const membro = await membroEquipeRepository.adicionar(dto.usuarioId, equipeId);

        return membroEquipeMapper.paraResponseDTO(membro);
    }

    async remover(equipeId, usuarioId, usuarioLogadoId) {
        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const executor = await membroEquipeRepository.buscar(
            usuarioLogadoId,
            equipeId
        );

        if (
            !executor ||
            (executor.cargo !== "DONO" && executor.cargo !== "LIDER")
        ) {
            throw new AppError(
                "Você não possui permissão para remover membros",
                403
            );
        }

        if (Number(usuarioId) === Number(usuarioLogadoId)) {
            throw new AppError(
                "Para sair da equipe, utilize a rota de saída voluntária",
                400
            );
        }

        const alvo = await membroEquipeRepository.buscar(
            usuarioId,
            equipeId
        );

        if (!alvo) {
            throw new AppError(
                "Usuário não pertence a esta equipe",
                404
            );
        }

        if (alvo.cargo === "DONO") {
            throw new AppError(
                "O proprietário da equipe não pode ser removido",
                403
            );
        }

        if (executor.cargo === "LIDER" && alvo.cargo === "LIDER") {
            throw new AppError(
                "Líderes não podem remover outros líderes",
                403
            );
        }

        await membroEquipeRepository.removerComDesatribuicao(usuarioId, equipeId);
    }

    async alterarCargo(equipeId, usuarioId, dados, usuarioLogadoId) {
        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const executor = await membroEquipeRepository.buscar(usuarioLogadoId, equipeId);

        if (!executor) {
            throw new AppError("Você não pertence a esta equipe", 403);
        }

        const alvo = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!alvo) {
            throw new AppError("Usuário não pertence a esta equipe", 404);
        }

        if (Number(usuarioId) === Number(usuarioLogadoId)) {
            throw new AppError("Você não pode alterar o próprio cargo", 400);
        }

        const dto = new AlterarCargoMembroDTO(dados);

        if (dto.cargo === "DONO") {
            throw new AppError("O cargo DONO só pode ser atribuído por transferência de liderança", 400);
        }

        if (executor.cargo !== "DONO" && executor.cargo !== "LIDER") {
            throw new AppError("Você não possui permissão para alterar cargos", 403);
        }

        if (executor.cargo === "LIDER") {
            if (alvo.cargo === "DONO" || alvo.cargo === "LIDER") {
                throw new AppError("Líderes só podem alterar membros abaixo do seu nível", 403);
            }
        }

        const membroAtualizado = await membroEquipeRepository.alterarCargo(usuarioId, equipeId, dto.cargo);
        return membroEquipeMapper.paraResponseDTO(membroAtualizado);
    }

    async sairDaEquipe(equipeId, usuarioLogadoId) {
        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const membro = await membroEquipeRepository.buscar(
            usuarioLogadoId,
            equipeId
        );

        if (!membro) {
            throw new AppError("Você não pertence a esta equipe", 404);
        }

        if (membro.cargo === "DONO") {
            throw new AppError(
                "O DONO deve transferir a propriedade antes de sair da equipe",
                403
            );
        }

        await membroEquipeRepository.removerComDesatribuicao(usuarioLogadoId, equipeId);
    }

    async transferirPropriedade(equipeId, novoDonoId, usuarioLogadoId) {
        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const donoAtual = await membroEquipeRepository.buscar(usuarioLogadoId, equipeId);

        if (!donoAtual || donoAtual.cargo !== "DONO") {
            throw new AppError("Apenas o DONO pode transferir a propriedade da equipe", 403);
        }

        if (Number(novoDonoId) === Number(usuarioLogadoId)) {
            throw new AppError("Você já é o proprietário desta equipe", 400);
        }

        const novoDono = await membroEquipeRepository.buscar(novoDonoId, equipeId);

        if (!novoDono) {
            throw new AppError("O novo proprietário deve pertencer à equipe", 404);
        }

        const membroAtualizado = await membroEquipeRepository.transferirPropriedade(equipeId, usuarioLogadoId, novoDonoId);
        return membroEquipeMapper.paraResponseDTO(membroAtualizado);
    }
}

export default new MembroEquipeService();