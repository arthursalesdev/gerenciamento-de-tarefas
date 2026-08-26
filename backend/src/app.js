import express from "express";
import authRoutes from "./routes/authRoutes.js";
import tarefaRoutes from "./routes/tarefaRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tarefas", tarefaRoutes);

app.use(errorHandler);

export default app;