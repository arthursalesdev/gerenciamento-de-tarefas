import express from "express";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/authRoutes.js";
import tarefaRoutes from "./routes/tarefaRoutes.js";
import equipeRoutes from "./routes/equipeRoutes.js";
import membroEquipeRoutes from "./routes/membroEquipeRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerSpec from "./docs/swagger.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/equipes", equipeRoutes);
app.use("/equipes", membroEquipeRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;