import { eq, sql } from "drizzle-orm";

import {
    pgTable,
    pgEnum,
    serial,
    integer,
    timestamp,
    unique,
    uniqueIndex
} from "drizzle-orm/pg-core";

import { usuarios } from "./usuarios.js";
import { equipes } from "./equipes.js";

export const cargoEquipeEnum = pgEnum(
    "cargo_equipe",
    [
        "DONO",
        "LIDER",
        "MEMBRO",
        "VISUALIZADOR"
    ]
);

export const membrosEquipes = pgTable(
    "membros_equipes",
    {
        id: serial("id").primaryKey(),

        usuarioId: integer("usuario_id")
            .notNull()
            .references(() => usuarios.id),

        equipeId: integer("equipe_id")
            .notNull()
            .references(() => equipes.id, {
                onDelete: "cascade"
            }),

        cargo: cargoEquipeEnum("cargo")
            .notNull()
            .default("MEMBRO"),

        criadoEm: timestamp("criado_em")
            .defaultNow()
            .notNull()
    },
    (table) => ({
        // Impede o mesmo usuário de entrar duas vezes na equipe.
        usuarioEquipeUnico: unique(
            "membros_equipes_usuario_equipe_unique"
        ).on(table.usuarioId, table.equipeId),

        // Permite no máximo um DONO por equipe.
        donoEquipeUnico: uniqueIndex(
            "membros_equipes_dono_unico"
        )
            .on(table.equipeId)
            .where(sql`${table.cargo} = 'DONO'`)
    })
);