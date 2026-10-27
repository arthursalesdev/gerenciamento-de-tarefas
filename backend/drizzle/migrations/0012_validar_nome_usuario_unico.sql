ALTER TABLE "usuarios" ALTER COLUMN "nome_usuario" SET NOT NULL;

CREATE UNIQUE INDEX "usuarios_nome_usuario_lower_unique" ON "usuarios" (LOWER("nome_usuario"));