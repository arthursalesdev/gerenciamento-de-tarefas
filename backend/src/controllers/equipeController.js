import equipeService from "../services/equipeService.js";

class EquipeController {
    async listar(req, res, next) {
        try {
            const equipes = await equipeService.listar(req.usuario.id);
            return res.status(200).json(equipes);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const id = Number(req.params.id);
            const equipe = await equipeService.buscarPorId(id, req.usuario.id);
            return res.status(200).json(equipe);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const usuarioId = req.usuario.id;
            const equipe = await equipeService.criar(req.body, usuarioId)
            return res.status(201).json(equipe);
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.usuario.id;
            const equipe = await equipeService.atualizar(id, req.body, usuarioId);
            return res.status(200).json(equipe);
        } catch (error) {
            next(error);
        }
    }

    async deletar(req, res, next) {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.usuario.id;
            await equipeService.deletar(id, usuarioId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new EquipeController();