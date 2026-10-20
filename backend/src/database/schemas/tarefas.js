import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

import { usuarios } from "./usuarios.js";
import { equipes } from "./equipes.js";

export const tarefas = pgTable("tarefas", {
    id: serial("id").primaryKey(),
    usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
    equipeId: integer("equipe_id").references(() => equipes.id, { onDelete: "cascade" }),
    responsavelId: integer("responsavel_id").references(() => usuarios.id),
    titulo: varchar("titulo", { length: 150 }).notNull(),
    descricao: text("descricao"),
    status: varchar("status", { length: 20 }).notNull().default("PENDENTE"),
    prioridade: varchar("prioridade", { length: 20 }).notNull().default("MEDIA"),
    dataLimite: timestamp("data_limite"),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
    atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
    excluidoEm: timestamp("excluido_em")
});