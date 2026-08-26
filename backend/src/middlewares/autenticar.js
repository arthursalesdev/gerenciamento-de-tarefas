import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: "Token não informado" });
    }

    const [tipo, token] = authorization.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token inválido" });
    }

    try {
        const payload = jwt.verify( token, process.env.JWT_SECRET );
        req.usuario = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
}