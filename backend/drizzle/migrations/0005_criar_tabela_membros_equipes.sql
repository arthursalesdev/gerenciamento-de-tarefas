CREATE TABLE "membros_equipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"equipe_id" integer NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "membros_equipes_usuario_equipe_unique" UNIQUE("usuario_id","equipe_id")
);
--> statement-breakpoint
ALTER TABLE "membros_equipes" ADD CONSTRAINT "membros_equipes_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membros_equipes" ADD CONSTRAINT "membros_equipes_equipe_id_equipes_id_fk" FOREIGN KEY ("equipe_id") REFERENCES "public"."equipes"("id") ON DELETE no action ON UPDATE no action;