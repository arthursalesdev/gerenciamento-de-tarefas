CREATE UNIQUE INDEX "membros_equipes_dono_unico"
ON "membros_equipes" USING btree ("equipe_id")
WHERE "cargo" = 'DONO';