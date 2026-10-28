import { and, eq } from "drizzle-orm";

import { db } from "../database/connection.js";
import { convitesEquipes } from "../database/schemas/convitesEquipes.js";
import { membrosEquipes } from "../database/schemas/membrosEquipes.js";
import AppError from "../errors/AppError.js";

class ConviteEquipeRepository {
    async criar(dados) {
        const resultado = await db.insert(convitesEquipes).values(dados).returning();
        return resultado[0];
    }

    async buscarPorId(id) {
        const resultado = await db.select().from(convitesEquipes).where(eq(convitesEquipes.id, id)).limit(1);
        return resultado[0] || null;
    }

    async buscarPendente(equipeId, convidadoId) {
        const resultado = await db
            .select().from(convitesEquipes)
            .where(
                and(
                    eq(convitesEquipes.equipeId, equipeId),
                    eq(convitesEquipes.convidadoId, convidadoId),
                    eq(convitesEquipes.status, "PENDENTE")
                )
            ).limit(1);

        return resultado[0] || null;
    }

    async listarPorConvidado(convidadoId) {
        return await db.select().from(convitesEquipes).where(eq(convitesEquipes.convidadoId, convidadoId));
    }

    async listarPorEquipe(equipeId) {
        return await db.select().from(convitesEquipes).where(eq(convitesEquipes.equipeId, equipeId));
    }

    async alterarStatus(id, status) {
        const resultado = await db
            .update(convitesEquipes)
            .set({ status, respondidoEm: new Date() })
            .where(and(eq(convitesEquipes.id, id), eq(convitesEquipes.status, "PENDENTE")))
            .returning();

        return resultado[0] || null;
    }

    async aceitar(id, convidadoId) {
        return await db.transaction(async (tx) => {
            const resultado = await tx.select().from(convitesEquipes).where(eq(convitesEquipes.id, id)).for("update");
            const convite = resultado[0];

            if (!convite) {
                throw new AppError("Convite não encontrado", 404);
            }

            if (convite.convidadoId !== convidadoId) {
                throw new AppError("Este convite não pertence a você", 403);
            }

            if (convite.status !== "PENDENTE") {
                throw new AppError("Este convite não está mais pendente", 409);
            }

            const membros = await tx.select().from(membrosEquipes).where(and(eq(membrosEquipes.equipeId, convite.equipeId), eq(membrosEquipes.usuarioId, convidadoId))).limit(1);

            if (membros.length > 0) {
                throw new AppError("Você já pertence a esta equipe", 409);
            }

            await tx.insert(membrosEquipes).values({ usuarioId: convidadoId, equipeId: convite.equipeId, cargo: convite.cargo });
            const atualizados = await tx.update(convitesEquipes).set({ status: "ACEITO", respondidoEm: new Date() }).where(eq(convitesEquipes.id, id)).returning();
            return atualizados[0];
        });
    }
}

export default new ConviteEquipeRepository();
