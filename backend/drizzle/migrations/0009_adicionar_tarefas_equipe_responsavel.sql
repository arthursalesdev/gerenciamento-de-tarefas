ALTER TABLE "tarefas" ADD COLUMN "equipe_id" integer;--> statement-breakpoint
ALTER TABLE "tarefas" ADD COLUMN "responsavel_id" integer;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_equipe_id_equipes_id_fk" FOREIGN KEY ("equipe_id") REFERENCES "public"."equipes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_responsavel_id_usuarios_id_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;