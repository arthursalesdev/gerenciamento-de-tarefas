import { eq, and, isNull } from "drizzle-orm";
import { db } from "../database/connection.js";
import { tarefas } from "../database/schemas/tarefas.js";

class TarefaRepository {
    async listarTodas(usuarioId) {
        return await db.select().from(tarefas).where(and(eq(tarefas.usuarioId, usuarioId), isNull(tarefas.excluidoEm)));
    }

    async buscarPorId(id, usuarioId) {
        const resultado = await db.select().from(tarefas).where(and(eq(tarefas.id, id), eq(tarefas.usuarioId, usuarioId), isNull(tarefas.excluidoEm)));
        return resultado[0];
    }

    async criar(dados) {
        const resultado = await db.insert(tarefas).values(dados).returning();
        return resultado[0];
    }

    async atualizar(id, usuarioId, dados) {
        const resultado = await db.update(tarefas).set({ ...dados, atualizadoEm: new Date() }).where(and(eq(tarefas.id, id), eq(tarefas.usuarioId, usuarioId), isNull(tarefas.excluidoEm))).returning();
        return resultado[0];
    }

    async deletar(id, usuarioId) {
        const resultado = await db.update(tarefas).set({ excluidoEm: new Date(), atualizadoEm: new Date() }).where(and(eq(tarefas.id, id), eq(tarefas.usuarioId, usuarioId), isNull(tarefas.excluidoEm))).returning();
        return resultado[0];
    }
}

export default new TarefaRepository();