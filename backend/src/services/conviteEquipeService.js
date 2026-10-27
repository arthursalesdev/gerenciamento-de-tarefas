import conviteEquipeRepository from "../repositories/conviteEquipeRepository.js";
import membroEquipeRepository from "../repositories/membroEquipeRepository.js";
import equipeRepository from "../repositories/equipeRepository.js";
import usuarioRepository from "../repositories/usuarioRepository.js";
import AppError from "../errors/AppError.js";

class ConviteEquipeService {
    async enviar(dados, usuarioId) {
        const equipeId = Number(dados?.equipeId);
        const convidadoId = Number(dados?.convidadoId);
        const cargo = dados?.cargo ?? "MEMBRO";

        if (!Number.isSafeInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        if (!Number.isSafeInteger(convidadoId) || convidadoId <= 0) {
            throw new AppError("ID do convidado inválido", 400);
        }

        if (!["LIDER", "MEMBRO", "VISUALIZADOR"].includes(cargo)) {
            throw new AppError("Cargo do convite inválido", 400);
        }

        const equipe = await equipeRepository.buscarPorId(equipeId);

        if (!equipe) {
            throw new AppError("Equipe não encontrada", 404);
        }

        const remetente = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!remetente || !["DONO", "LIDER"].includes(remetente.cargo)) {
            throw new AppError("Somente DONO ou LIDER podem enviar convites", 403);
        }

        if (cargo === "LIDER" && remetente.cargo !== "DONO") {
            throw new AppError("Somente o DONO pode convidar novos líderes", 403);
        }

        const convidado = await usuarioRepository.buscarPorId(convidadoId);

        if (!convidado) {
            throw new AppError("Usuário convidado não encontrado", 404);
        }

        const membroExistente = await membroEquipeRepository.buscar(convidadoId, equipeId);

        if (membroExistente) {
            throw new AppError("Este usuário já faz parte da equipe", 409);
        }

        const conviteExistente =
            await conviteEquipeRepository.buscarPendente(equipeId, convidadoId);

        if (conviteExistente) {
            throw new AppError("Já existe um convite pendente para este usuário", 409);
        }

        return await conviteEquipeRepository.criar({
            equipeId, convidadorId: usuarioId, convidadoId, cargo
        });
    }

    async listarRecebidos(usuarioId) {
        return await conviteEquipeRepository.listarPorConvidado(usuarioId);
    }

    async listarPorEquipe(equipeId, usuarioId) {
        if (!Number.isSafeInteger(equipeId) || equipeId <= 0) {
            throw new AppError("ID da equipe inválido", 400);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, equipeId);

        if (!membro || !["DONO", "LIDER"].includes(membro.cargo)) {
            throw new AppError("Você não possui permissão para consultar os convites desta equipe", 403);
        }

        return await conviteEquipeRepository.listarPorEquipe(equipeId);
    }

    async aceitar(conviteId, usuarioId) {
        if (!Number.isSafeInteger(conviteId) || conviteId <= 0) {
            throw new AppError("ID do convite inválido", 400);
        }

        return await conviteEquipeRepository.aceitar(conviteId, usuarioId);
    }

    async recusar(conviteId, usuarioId) {
        if (!Number.isSafeInteger(conviteId) || conviteId <= 0) {
            throw new AppError("ID do convite inválido", 400);
        }

        const convite = await conviteEquipeRepository.buscarPorId(conviteId);

        if (!convite) {
            throw new AppError("Convite não encontrado", 404);
        }

        if (String(convite.convidadoId) !== String(usuarioId)) {
            throw new AppError("Somente o destinatário pode recusar este convite", 403);
        }

        if (convite.status !== "PENDENTE") {
            throw new AppError("Este convite não está mais pendente", 409);
        }

        const atualizado = await conviteEquipeRepository.alterarStatus(conviteId, "RECUSADO");

        if (!atualizado) {
            throw new AppError("Este convite não está mais pendente", 409);
        }

        return atualizado;
    }

    async cancelar(conviteId, usuarioId) {
        if (!Number.isSafeInteger(conviteId) || conviteId <= 0) {
            throw new AppError("ID do convite inválido", 400);
        }

        const convite = await conviteEquipeRepository.buscarPorId(conviteId);

        if (!convite) {
            throw new AppError("Convite não encontrado", 404);
        }

        const membro = await membroEquipeRepository.buscar(usuarioId, convite.equipeId);

        if (!membro || !["DONO", "LIDER"].includes(membro.cargo)) {
            throw new AppError("Somente DONO ou LIDER podem cancelar convites", 403);
        }

        if (convite.status !== "PENDENTE") {
            throw new AppError("Este convite não está mais pendente", 409);
        }

        const atualizado = await conviteEquipeRepository.alterarStatus(conviteId, "CANCELADO");

        if (!atualizado) {
            throw new AppError("Este convite não está mais pendente", 409);
        }

        return atualizado;
    }
}

export default new ConviteEquipeService();
