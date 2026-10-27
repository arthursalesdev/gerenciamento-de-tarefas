import conviteEquipeService from "../services/conviteEquipeService.js";

class ConviteEquipeController {
    async enviar(req, res, next) {
        try {
            const convite = await conviteEquipeService.enviar(req.body, req.usuario.id);
            return res.status(201).json(convite);
        } catch (error) {
            next(error);
        }
    }

    async listarRecebidos(req, res, next) {
        try {
            const convites = await conviteEquipeService.listarRecebidos(req.usuario.id);
            return res.status(200).json(convites);
        } catch (error) {
            next(error);
        }
    }

    async listarPorEquipe(req, res, next) {
        try {
            const convites = await conviteEquipeService.listarPorEquipe(Number(req.params.equipeId), req.usuario.id);
            return res.status(200).json(convites);
        } catch (error) {
            next(error);
        }
    }

    async aceitar(req, res, next) {
        try {
            const convite = await conviteEquipeService.aceitar(Number(req.params.conviteId), req.usuario.id);
            return res.status(200).json(convite);
        } catch (error) {
            next(error);
        }
    }

    async recusar(req, res, next) {
        try {
            const convite = await conviteEquipeService.recusar(Number(req.params.conviteId), req.usuario.id);
            return res.status(200).json(convite);
        } catch (error) {
            next(error);
        }
    }

    async cancelar(req, res, next) {
        try {
            const convite = await conviteEquipeService.cancelar(Number(req.params.conviteId), req.usuario.id);
            return res.status(200).json(convite);
        } catch (error) {
            next(error);
        }
    }
}

export default new ConviteEquipeController();
