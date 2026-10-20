import { eq, inArray } from "drizzle-orm";

import { db } from "../database/connection.js";
import { equipes } from "../database/schemas/equipes.js";

class EquipeRepository {
    async listar() {
        return await db
            .select()
            .from(equipes);
    }

    async buscarPorId(id) {
        const resultado = await db
            .select()
            .from(equipes)
            .where(eq(equipes.id, id))
            .limit(1);

        return resultado[0] || null;
    }

    async criar(dados) {
        const resultado = await db
            .insert(equipes)
            .values(dados)
            .returning();

        return resultado[0];
    }

    async atualizar(id, dados) {
        const resultado = await db
            .update(equipes)
            .set({
                ...dados,
                atualizadoEm: new Date()
            })
            .where(eq(equipes.id, id))
            .returning();

        return resultado[0] || null;
    }

    async deletar(id) {
        const resultado = await db
            .delete(equipes)
            .where(eq(equipes.id, id))
            .returning();

        return resultado[0] || null;
    }

    async listarPorIds(ids) {
        if (!ids.length) {
            return [];
        }

        return await db
            .select()
            .from(equipes)
            .where(inArray(equipes.id, ids));
    }
}

export default new EquipeRepository();