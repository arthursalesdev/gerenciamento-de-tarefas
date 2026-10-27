import membroEquipeService from "../services/membroEquipeService.js";

class MembroEquipeController {
    async listar(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const usuarioLogadoId = req.usuario.id;
            const membros = await membroEquipeService.listar(equipeId, usuarioLogadoId);
            return res.status(200).json(membros);
        } catch (error) {
            next(error);
        }
    }

    async remover(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const usuarioId = Number(req.params.usuarioId);
            const usuarioLogadoId = req.usuario.id;
            await membroEquipeService.remover(equipeId, usuarioId, usuarioLogadoId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async alterarCargo(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const usuarioId = Number(req.params.usuarioId);
            const usuarioLogadoId = req.usuario.id;
            const membro = await membroEquipeService.alterarCargo(equipeId, usuarioId, req.body, usuarioLogadoId);
            return res.status(200).json(membro);
        } catch (error) {
            next(error);
        }
    }

    async sairDaEquipe(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const usuarioLogadoId = req.usuario.id;

            if (!Number.isSafeInteger(equipeId) || equipeId <= 0) {
                return res.status(400).json({
                    mensagem: "O ID da equipe deve ser um número inteiro positivo"
                });
            }

            await membroEquipeService.sairDaEquipe(
                equipeId,
                usuarioLogadoId
            );

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async transferirPropriedade(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const novoDonoId = Number(req.body.novoDonoId);
            const usuarioLogadoId = req.usuario.id;

            if (
                !Number.isSafeInteger(equipeId) ||
                equipeId <= 0 ||
                !Number.isSafeInteger(novoDonoId) ||
                novoDonoId <= 0
            ) {
                return res.status(400).json({
                    message: "IDs da equipe e do novo proprietário devem ser números inteiros positivos"
                });
            }

            const novoDono = await membroEquipeService.transferirPropriedade(
                equipeId,
                novoDonoId,
                usuarioLogadoId
            );

            return res.status(200).json(novoDono);
        } catch (error) {
            next(error);
        }
    }
}

export default new MembroEquipeController();