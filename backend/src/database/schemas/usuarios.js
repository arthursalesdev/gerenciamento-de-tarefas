import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    senha: varchar("senha", { length: 255 }).notNull(),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
    atualizadoEm: timestamp("atualizado_em").notNull().defaultNow()
});