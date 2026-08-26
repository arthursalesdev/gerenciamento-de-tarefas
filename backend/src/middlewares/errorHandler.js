export function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        mensagem: error.message || "Erro interno do servidor"
    });
}