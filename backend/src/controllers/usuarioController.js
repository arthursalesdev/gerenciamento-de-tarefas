import usuarioRepository from "../repositories/usuarioRepository.js";
import membroEquipeRepository from "../repositories/membroEquipeRepository.js";
import AppError from "../errors/AppError.js";

function dadosPublicos(usuario) {
    return {
        id: usuario.id, nome: usuario.nome, nomeUsuario: usuario.nomeUsuario, tag: usuario.tag
    };
}

class UsuarioController {

    async buscar(req, res, next) {
        try {
            const { nomeUsuario, tag } = req.query;

            if (typeof nomeUsuario !== "string" || !nomeUsuario.trim()) {
                throw new AppError("Nome de usuário é obrigatório", 400);
            }

            if (typeof tag !== "string" || !/^\d{4}$/.test(tag)) {
                throw new AppError("A tag deve conter exatamente quatro dígitos", 400);
            }

            const usuario = await usuarioRepository.buscarPorNomeUsuarioETag(nomeUsuario.trim(), tag);

            if (!usuario) {
                throw new AppError("Usuário não encontrado", 404);
            }

            return res.status(200).json(dadosPublicos(usuario));
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const usuarioId = Number(req.params.id);
            const solicitanteId = req.usuario.id;

            if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
                throw new AppError("ID do usuário inválido", 400);
            }

            const usuario = await usuarioRepository.buscarPorId(usuarioId);

            if (!usuario) {
                throw new AppError("Usuário não encontrado", 404);
            }

            if (String(usuarioId) !== String(solicitanteId)) {
                const minhasEquipes = await membroEquipeRepository.listarPorUsuario(solicitanteId);
                const equipesDoUsuario = await membroEquipeRepository.listarPorUsuario(usuarioId);
                const compartilhamEquipe = minhasEquipes.some((minhaParticipacao) => equipesDoUsuario.some((participacao) => String(participacao.equipeId) === String(minhaParticipacao.equipeId)));

                if (!compartilhamEquipe) {
                    throw new AppError("Você não possui acesso a este usuário", 403);
                }
            }

            return res.status(200).json(dadosPublicos(usuario));
        } catch (error) {
            next(error);
        }
    }
}

export default new UsuarioController();
