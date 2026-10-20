# Roteiro de Testes — Equipes

**Arquivo:** `equipes.http`

## Pré-condições

- Arthur (ID 1) é DONO da equipe 2.
- João (ID 2) é LIDER da equipe 2.
- João não participa da equipe 4.
- A equipe 2 possui outros membros.
- A equipe temporária será criada durante os testes.

## Ordem de execução

### Etapa 1 — Autenticação

| Ordem | Teste | Esperado |
|---|---|---|
| 1 | AUTH-01 | 200 |
| 2 | AUTH-02 | 200 |

### Etapa 2 — Preparação

| Ordem | Teste | Esperado |
|---|---|---|
| 3 | CRIACAO-01 | 201 |
| 4 | CRIACAO-02 | 201 |

A criação da equipe temporária fornece o ID utilizado na criação da tarefa e na exclusão em cascata.

### Etapa 3 — Listagem e consulta

| Ordem | Teste | Esperado |
|---|---|---|
| 5 | LISTAGEM-01 | 200 |
| 6 | LISTAGEM-02 | 200 |
| 7 | CONSULTA-01 | 200 |
| 8 | CONSULTA-02 | 200 |
| 9 | CONSULTA-03 | 403 |

### Etapa 4 — Atualização

| Ordem | Teste | Esperado |
|---|---|---|
| 10 | ATUALIZACAO-01 | 200 |
| 11 | ATUALIZACAO-02 | 403 |

### Etapa 5 — Validações

| Ordem | Teste | Esperado |
|---|---|---|
| 12 | VALIDACAO-01 | 400 |
| 13 | VALIDACAO-02 | 400 |
| 14 | VALIDACAO-03 | 400 |

### Etapa 6 — Transferência de propriedade

| Ordem | Teste | Esperado |
|---|---|---|
| 15 | PROPRIEDADE-01 | 200 |
| 16 | PROPRIEDADE-02 | 200 |
| 17 | PROPRIEDADE-03 | 403 |
| 18 | PROPRIEDADE-04 | 200 |

**Executar os quatro testes em sequência.**

Após `PROPRIEDADE-01`, João passa a ser DONO e Arthur deixa de ser DONO.

Após `PROPRIEDADE-04`, Arthur deve voltar a ser DONO.

### Etapa 7 — Exclusão

| Ordem | Teste | Esperado |
|---|---|---|
| 19 | EXCLUSAO-01 | 409 |
| 20 | EXCLUSAO-02 | 204 |
| 21 | EXCLUSAO-03 | 404 |
| 22 | EXCLUSAO-04 | 404 |

## Cuidados

- `EXCLUSAO-01` não deve remover a equipe principal.
- `EXCLUSAO-02` deve remover somente a equipe temporária criada no teste.
- `EXCLUSAO-04` verifica a inacessibilidade da tarefa após a exclusão da equipe.
- A confirmação da exclusão física em cascata exige inspeção do banco, além da resposta HTTP.
- Se a transferência de propriedade falhar ou for interrompida, restaurar os cargos antes de repetir a bateria.

## Estado final esperado

- Arthur continua DONO da equipe 2.
- João continua LIDER da equipe 2.
- A equipe temporária foi excluída.
- A tarefa temporária não está mais acessível.