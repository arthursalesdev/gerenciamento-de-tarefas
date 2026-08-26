import { eq } from "drizzle-orm";
import { db } from "../database/connection.js";
import { usuarios } from "../database/schemas/usuarios.js";

class UsuarioRepository {
    async buscarPorEmail(email) {
        const resultado = await db.select().from(usuarios).where(eq(usuarios.email, email));
        return resultado[0];
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