import { sql } from "drizzle-orm";

import { pgTable, pgEnum, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { usuarios } from "./usuarios.js";
import { equipes } from "./equipes.js";
import { cargoEquipeEnum } from "./membrosEquipes.js";

export const statusConviteEquipeEnum = pgEnum(
    "status_convite_equipe",
    ["PENDENTE", "ACEITO", "RECUSADO", "CANCELADO"]
);

export const convitesEquipes = pgTable(
    "convites_equipes",
    {
        id: serial("id").primaryKey(),
        equipeId: integer("equipe_id").notNull().references(() => equipes.id, { onDelete: "cascade" }),
        convidadorId: integer("convidador_id").notNull().references(() => usuarios.id),
        convidadoId: integer("convidado_id").notNull().references(() => usuarios.id),
        cargo: cargoEquipeEnum("cargo").notNull().default("MEMBRO"),
        status: statusConviteEquipeEnum("status").notNull().default("PENDENTE"),
        criadoEm: timestamp("criado_em").notNull().defaultNow(),
        respondidoEm: timestamp("respondido_em")
    },
    (table) => ({
        convitePendenteUnico: uniqueIndex("convites_equipes_pendente_unique").on(table.equipeId, table.convidadoId).where(sql`${table.status} = 'PENDENTE'`)
    })
);
