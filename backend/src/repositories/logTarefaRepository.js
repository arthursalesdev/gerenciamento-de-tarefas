import { eq } from "drizzle-orm";
import { db } from "../database/connection.js";
import { logsTarefas } from "../database/schemas/logsTarefas.js";

class LogTarefaRepository {
    async criar(dados) {
        const resultado = await db.insert(logsTarefas).values(dados).returning();
        return resultado[0];
    }

    async listarPorTarefa(tarefaId) {
        return await db.select().from(logsTarefas).where(eq(logsTarefas.tarefaId, tarefaId));
    }
}

export default new LogTarefaRepository();