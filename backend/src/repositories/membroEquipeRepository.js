import { and, eq } from "drizzle-orm";

import { db } from "../database/connection.js";
import { membrosEquipes } from "../database/schemas/membrosEquipes.js";
import AppError from "../errors/AppError.js";

class MembroEquipeRepository {

    async listarPorEquipe(equipeId) {
        return await db
            .select()
            .from(membrosEquipes)
            .where(eq(membrosEquipes.equipeId, equipeId));
    }

    async listarPorUsuario(usuarioId) {
        return await db
            .select()
            .from(membrosEquipes)
            .where(eq(membrosEquipes.usuarioId, usuarioId));
    }

    async buscar(usuarioId, equipeId) {
        const resultado = await db
            .select()
            .from(membrosEquipes)
            .where(
                and(
                    eq(membrosEquipes.usuarioId, usuarioId),
                    eq(membrosEquipes.equipeId, equipeId)
                )
            )
            .limit(1);

        return resultado[0] || null;
    }

    async adicionar(usuarioId, equipeId, cargo = "MEMBRO") {
        const resultado = await db
            .insert(membrosEquipes)
            .values({
                usuarioId,
                equipeId,
                cargo
            })
            .returning();

        return resultado[0];
    }

    async remover(usuarioId, equipeId) {
        const resultado = await db
            .delete(membrosEquipes)
            .where(
                and(
                    eq(membrosEquipes.usuarioId, usuarioId),
                    eq(membrosEquipes.equipeId, equipeId)
                )
            )
            .returning();

        return resultado[0] || null;
    }

    async contarPorEquipe(equipeId) {
        const membros = await this.listarPorEquipe(equipeId);
        return membros.length;
    }

    async alterarCargo(usuarioId, equipeId, cargo) {
        const resultado = await db
            .update(membrosEquipes)
            .set({
                cargo
            })
            .where(
                and(
                    eq(membrosEquipes.usuarioId, usuarioId),
                    eq(membrosEquipes.equipeId, equipeId)
                )
            )
            .returning();

        return resultado[0] || null;
    }

    async transferirPropriedade(equipeId, donoAtualId, novoDonoId) {
        return await db.transaction(async (tx) => {
            // Bloqueia os membros da equipe durante a transferência.
            const membros = await tx
                .select()
                .from(membrosEquipes)
                .where(eq(membrosEquipes.equipeId, equipeId))
                .for("update");

            // Confere novamente quem é o DONO dentro da transação.
            const donos = membros.filter(
                (membro) => membro.cargo === "DONO"
            );

            if (
                donos.length !== 1 ||
                donos[0].usuarioId !== donoAtualId
            ) {
                throw new AppError(
                    "A propriedade da equipe foi alterada. Atualize os dados e tente novamente",
                    409
                );
            }

            // Confere se o destinatário continua na equipe.
            const destinatario = membros.find(
                (membro) => membro.usuarioId === novoDonoId
            );

            if (!destinatario) {
                throw new AppError(
                    "O novo proprietário não pertence mais à equipe",
                    409
                );
            }

            // Rebaixa o DONO atual para LIDER.
            const antigosDonos = await tx
                .update(membrosEquipes)
                .set({ cargo: "LIDER" })
                .where(
                    and(
                        eq(membrosEquipes.equipeId, equipeId),
                        eq(membrosEquipes.usuarioId, donoAtualId),
                        eq(membrosEquipes.cargo, "DONO")
                    )
                )
                .returning();

            if (antigosDonos.length !== 1) {
                throw new AppError(
                    "Não foi possível atualizar o proprietário atual",
                    409
                );
            }

            // Promove o destinatário para DONO.
            const novosDonos = await tx
                .update(membrosEquipes)
                .set({ cargo: "DONO" })
                .where(
                    and(
                        eq(membrosEquipes.equipeId, equipeId),
                        eq(membrosEquipes.usuarioId, novoDonoId)
                    )
                )
                .returning();

            if (novosDonos.length !== 1) {
                throw new AppError(
                    "Não foi possível definir o novo proprietário",
                    409
                );
            }

            return novosDonos[0];
        });
    }
}

export default new MembroEquipeRepository();