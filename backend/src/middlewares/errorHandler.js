export function errorHandler(error, req, res, next) {
    const statusCode =
        Number.isInteger(error.statusCode) &&
        error.statusCode >= 400 &&
        error.statusCode <= 599
            ? error.statusCode
            : 500;

    if (statusCode >= 500) {
        console.error("Erro interno:", error);
    }

    return res.status(statusCode).json({
        mensagem:
            statusCode >= 500
                ? "Erro interno do servidor"
                : error.message || "Erro na requisição"
    });
}