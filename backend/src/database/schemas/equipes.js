import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios.js";

export const equipes = pgTable("equipes", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 100 }).notNull(),
    criadorId: integer("criador_id").notNull().references(() => usuarios.id),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().notNull()
});