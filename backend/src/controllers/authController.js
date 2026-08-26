import authService from "../services/authService.js";

class AuthController {
    async cadastrar(req, res, next) {
        try {
            const usuario = await authService.cadastrar(req.body);
            return res.status(201).json(usuario);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const resultado = await authService.login(req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();