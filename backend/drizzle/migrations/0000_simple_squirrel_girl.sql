CREATE TABLE "logs_tarefas" (
	"id" serial PRIMARY KEY NOT NULL,
	"tarefa_id" integer NOT NULL,
	"acao" varchar(30) NOT NULL,
	"alterado_por" varchar(100) NOT NULL,
	"alterado_em" timestamp DEFAULT now() NOT NULL,
	"detalhes" text
);
--> statement-breakpoint
CREATE TABLE "tarefas" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(150) NOT NULL,
	"descricao" text,
	"status" varchar(20) DEFAULT 'PENDENTE' NOT NULL,
	"prioridade" varchar(20) DEFAULT 'MEDIA' NOT NULL,
	"data_limite" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "logs_tarefas" ADD CONSTRAINT "logs_tarefas_tarefa_id_tarefas_id_fk" FOREIGN KEY ("tarefa_id") REFERENCES "public"."tarefas"("id") ON DELETE no action ON UPDATE no action;