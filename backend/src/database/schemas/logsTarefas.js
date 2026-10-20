import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { tarefas } from "./tarefas.js";
import { usuarios } from "./usuarios.js";

export const logsTarefas = pgTable("logs_tarefas", {
    id: serial("id").primaryKey(),
    tarefaId: integer("tarefa_id").notNull().references(() => tarefas.id, { onDelete: "cascade" }),
    acao: varchar("acao", { length: 30 }).notNull(),
    usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
    alteradoEm: timestamp("alterado_em").notNull().defaultNow(),
    detalhes: text("detalhes")
});