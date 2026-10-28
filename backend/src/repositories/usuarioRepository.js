import { and, eq, sql } from "drizzle-orm";
import { db } from "../database/connection.js";
import { usuarios } from "../database/schemas/usuarios.js";

class UsuarioRepository {
    async buscarPorEmail(email) {
        const resultado = await db.select().from(usuarios).where(eq(usuarios.email, email));
        return resultado[0];
    }

    async buscarPorNomeUsuario(nomeUsuario) {
        const resultado = await db.select().from(usuarios).where(sql`LOWER(${usuarios.nomeUsuario}) = LOWER(${nomeUsuario})`);
        return resultado[0];
    }

    async buscarPorNomeUsuarioETag(nomeUsuario, tag) {
        const resultado = await db.select().from(usuarios).where(and(sql`LOWER(${usuarios.nomeUsuario}) = LOWER(${nomeUsuario})`, eq(usuarios.tag, tag))).limit(1);
        return resultado[0] || null;
    }

    async buscarPorIdentificador(identificador) {
        const valor = identificador.trim();
        if (valor.includes("@")) {
            return this.buscarPorEmail(valor);
        }
        return this.buscarPorNomeUsuario(valor);
    }

    async buscarPorId(id) {
        const resultado = await db.select().from(usuarios).where(eq(usuarios.id, id));
        return resultado[0];
    }

    async criar(dados) {
        const resultado = await db.insert(usuarios).values(dados).returning();
        return resultado[0];
    }
}

export default new UsuarioRepository();