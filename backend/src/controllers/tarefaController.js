import tarefaService from "../services/tarefaService.js";

class TarefaController {
    async listarTodas(req, res, next) {
        try {
            const usuarioId = req.usuario.id;
            const tarefas = await tarefaService.listarTodas(usuarioId);
            return res.status(200).json(tarefas);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const usuarioId = req.usuario.id;
            const tarefa = await tarefaService.criar(req.body, usuarioId);
            return res.status(201).json(tarefa);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.usuario.id;
            const tarefa = await tarefaService.buscarPorId(id, usuarioId);
            return res.status(200).json(tarefa);
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.usuario.id;
            const tarefa = await tarefaService.atualizar(id, req.body, usuarioId);
            return res.status(200).json(tarefa);
        } catch (error) {
            next(error);
        }
    }

    async deletar(req, res, next) {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.usuario.id;
            await tarefaService.deletar(id, usuarioId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new TarefaController();