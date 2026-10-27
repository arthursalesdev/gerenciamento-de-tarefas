import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/authRoutes.js";
import tarefaRoutes from "./routes/tarefaRoutes.js";
import equipeRoutes from "./routes/equipeRoutes.js";
import membroEquipeRoutes from "./routes/membroEquipeRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import conviteEquipeRoutes from "./routes/conviteEquipeRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerSpec from "./docs/swagger.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/equipes", equipeRoutes);
app.use("/equipes", membroEquipeRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/convites-equipes", conviteEquipeRoutes);

app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;