CREATE TYPE "public"."status_convite_equipe" AS ENUM('PENDENTE', 'ACEITO', 'RECUSADO', 'CANCELADO');--> statement-breakpoint
CREATE TABLE "convites_equipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipe_id" integer NOT NULL,
	"convidador_id" integer NOT NULL,
	"convidado_id" integer NOT NULL,
	"cargo" "cargo_equipe" DEFAULT 'MEMBRO' NOT NULL,
	"status" "status_convite_equipe" DEFAULT 'PENDENTE' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"respondido_em" timestamp
);
--> statement-breakpoint
ALTER TABLE "convites_equipes" ADD CONSTRAINT "convites_equipes_equipe_id_equipes_id_fk" FOREIGN KEY ("equipe_id") REFERENCES "public"."equipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convites_equipes" ADD CONSTRAINT "convites_equipes_convidador_id_usuarios_id_fk" FOREIGN KEY ("convidador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convites_equipes" ADD CONSTRAINT "convites_equipes_convidado_id_usuarios_id_fk" FOREIGN KEY ("convidado_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "convites_equipes_pendente_unique" ON "convites_equipes" USING btree ("equipe_id","convidado_id") WHERE "convites_equipes"."status" = 'PENDENTE';