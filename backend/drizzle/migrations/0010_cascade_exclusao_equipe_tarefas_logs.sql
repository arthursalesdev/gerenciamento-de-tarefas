ALTER TABLE "logs_tarefas" DROP CONSTRAINT "logs_tarefas_tarefa_id_tarefas_id_fk";
--> statement-breakpoint
ALTER TABLE "tarefas" DROP CONSTRAINT "tarefas_equipe_id_equipes_id_fk";
--> statement-breakpoint
ALTER TABLE "logs_tarefas" ADD CONSTRAINT "logs_tarefas_tarefa_id_tarefas_id_fk" FOREIGN KEY ("tarefa_id") REFERENCES "public"."tarefas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_equipe_id_equipes_id_fk" FOREIGN KEY ("equipe_id") REFERENCES "public"."equipes"("id") ON DELETE cascade ON UPDATE no action;