ALTER TABLE "membros_equipes"
DROP CONSTRAINT "membros_equipes_equipe_id_equipes_id_fk";
--> statement-breakpoint
ALTER TABLE "membros_equipes"
ADD CONSTRAINT "membros_equipes_equipe_id_equipes_id_fk"
FOREIGN KEY ("equipe_id")
REFERENCES "public"."equipes"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;