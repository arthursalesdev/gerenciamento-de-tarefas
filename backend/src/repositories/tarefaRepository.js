import { eq, and, isNull } from "drizzle-orm";
import { db } from "../database/connection.js";
import { tarefas } from "../database/schemas/tarefas.js";

class TarefaRepository {
    async listarTodas(usuarioId) {
        return await db.select().from(tarefas).where(and(eq(tarefas.usuarioId, usuarioId), isNull(tarefas.equipeId), isNull(tarefas.excluidoEm)));
    }

    async buscarPorId(id, usuarioId) {
        const resultado = await db.select().from(tarefas).where(and(eq(tarefas.id, id), eq(tarefas.usuarioId, usuarioId), isNull(tarefas.equipeId), isNull(tarefas.excluidoEm)));
        return resultado[0];
    }

    async criar(dados, conexao = db) {
        const resultado = await conexao.insert(tarefas).values(dados).returning();
        return resultado[0];
    }

    async atualizar(id, usuarioId, dados, conexao = db) {
        const resultado = await conexao
            .update(tarefas)
            .set({
                ...dados,
                atualizadoEm: new Date()
            })
            .where(and(eq(tarefas.id, id), eq(tarefas.usuarioId, usuarioId), isNull(tarefas.equipeId), isNull(tarefas.excluidoEm)))
            .returning();

        return resultado[0] || null;
    }

    async deletar(id, usuarioId, conexao = db) {
        const resultado = await conexao
            .update(tarefas)
            .set({
                excluidoEm: new Date(),
                atualizadoEm: new Date()
            })
            .where(
                and(
                    eq(tarefas.id, id),
                    eq(tarefas.usuarioId, usuarioId),
                    isNull(tarefas.equipeId),
                    isNull(tarefas.excluidoEm)
                )
            )
            .returning();

        return resultado[0] || null;
    }

    async listarPorEquipe(equipeId) {
        return await db.select().from(tarefas).where(and(eq(tarefas.equipeId, equipeId), isNull(tarefas.excluidoEm)));
    }

    async buscarPorIdNaEquipe(tarefaId, equipeId) {
        const resultado = await db.select().from(tarefas).where(and(eq(tarefas.id, tarefaId), eq(tarefas.equipeId, equipeId), isNull(tarefas.excluidoEm))).limit(1);
        return resultado[0] || null;
    }

    async atualizarNaEquipe(tarefaId, equipeId, dados, conexao = db) {
        const resultado = await conexao
            .update(tarefas)
            .set({
                ...dados,
                atualizadoEm: new Date()
            })
            .where(and(eq(tarefas.id, tarefaId), eq(tarefas.equipeId, equipeId), isNull(tarefas.excluidoEm)))
            .returning();

        return resultado[0] || null;
    }

    async deletarNaEquipe(tarefaId, equipeId, conexao = db) {
        const resultado = await conexao
            .update(tarefas)
            .set({
                excluidoEm: new Date(),
                atualizadoEm: new Date()
            })
            .where(
                and(
                    eq(tarefas.id, tarefaId),
                    eq(tarefas.equipeId, equipeId),
                    isNull(tarefas.excluidoEm)
                )
            )
            .returning();

        return resultado[0] || null;
    }
}

export default new TarefaRepository();