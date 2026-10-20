CREATE TABLE "equipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"criador_id" integer NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "equipes" ADD CONSTRAINT "equipes_criador_id_usuarios_id_fk" FOREIGN KEY ("criador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;