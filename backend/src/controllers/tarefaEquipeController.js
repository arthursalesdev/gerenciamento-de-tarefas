
import tarefaService from "../services/tarefaService.js";

class TarefaEquipeController {
    async listarPorEquipe(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const usuarioId = req.usuario.id;
            const tarefas = await tarefaService.listarPorEquipe(equipeId, usuarioId);

            return res.status(200).json(tarefas);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorIdNaEquipe(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const tarefaId = Number(req.params.tarefaId);
            const usuarioId = req.usuario.id;
            const tarefa = await tarefaService.buscarPorIdNaEquipe(tarefaId, equipeId, usuarioId);

            return res.status(200).json(tarefa);
        } catch (error) {
            next(error);
        }
    }

    async atualizarNaEquipe(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const tarefaId = Number(req.params.tarefaId);
            const usuarioId = req.usuario.id;
            const tarefa = await tarefaService.atualizarNaEquipe(tarefaId, equipeId, req.body, usuarioId);

            return res.status(200).json(tarefa);
        } catch (error) {
            next(error);
        }
    }

    async deletarNaEquipe(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const tarefaId = Number(req.params.tarefaId);
            const usuarioId = req.usuario.id;

            await tarefaService.deletarNaEquipe(tarefaId, equipeId, usuarioId);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async atualizarResponsavel(req, res, next) {
        try {
            const equipeId = Number(req.params.equipeId);
            const tarefaId = Number(req.params.tarefaId);
            const usuarioId = req.usuario.id;
            const tarefa = await tarefaService.atualizarResponsavel(tarefaId, equipeId, req.body, usuarioId);

            return res.status(200).json(tarefa);
        } catch (error) {
            next(error);
        }
    }
}

export default new TarefaEquipeController();
