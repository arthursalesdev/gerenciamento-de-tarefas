# Roteiro de Testes — Tarefas

**Arquivo:** `tarefas.http`

## Pré-condições

- Arthur é DONO das equipes 2 e 3.
- João é LIDER da equipe 2 e MEMBRO da equipe 3.
- Maria é VISUALIZADOR da equipe 2.
- Os usuários e as equipes existem no banco.
- Os três logins retornam tokens válidos.

## Ordem de execução

### Etapa 1 — Autenticação

| Ordem | Teste | Esperado |
|---|---|---|
| 1 | AUTH-01 | 200 |
| 2 | AUTH-02 | 200 |
| 3 | AUTH-03 | 200 |

### Etapa 2 — Criação

| Ordem | Teste | Esperado |
|---|---|---|
| 4 | CRIACAO-01 | 201 |
| 5 | CRIACAO-02 | 201 |
| 6 | CRIACAO-03 | 400 |
| 7 | CRIACAO-04 | 403 |
| 8 | CRIACAO-05 | 201 |
| 9 | CRIACAO-06 | 201 |

As requisições `CRIACAO-01`, `CRIACAO-02`, `CRIACAO-05` e `CRIACAO-06` fornecem os IDs dinâmicos utilizados nos testes seguintes.

### Etapa 3 — Tarefas individuais

| Ordem | Teste | Esperado |
|---|---|---|
| 10 | INDIVIDUAL-01 | 200 |
| 11 | INDIVIDUAL-02 | 200 |
| 12 | INDIVIDUAL-03 | 200 |
| 13 | INDIVIDUAL-04 | 404 |

### Etapa 4 — Isolamento

| Ordem | Teste | Esperado |
|---|---|---|
| 14 | ISOLAMENTO-01 | 404 |
| 15 | ISOLAMENTO-02 | 404 |

### Etapa 5 — Consultas de equipe

| Ordem | Teste | Esperado |
|---|---|---|
| 16 | EQUIPE-01 | 200 |
| 17 | EQUIPE-02 | 200 |
| 18 | EQUIPE-03 | Verificar 403 ou 404 |
| 19 | EQUIPE-04 | 403 |
| 20 | EQUIPE-05 | 200 |
| 21 | EQUIPE-06 | 200 |
| 22 | EQUIPE-07 | 404 |
| 23 | EQUIPE-08 | 200 |

### Etapa 6 — Atualizações

| Ordem | Teste | Esperado |
|---|---|---|
| 24 | ATUALIZACAO-01 | 200 |
| 25 | ATUALIZACAO-02 | 200 |
| 26 | ATUALIZACAO-03 | 200 |
| 27 | ATUALIZACAO-04 | 404 |
| 28 | ATUALIZACAO-05 | 403 |
| 29 | ATUALIZACAO-06 | 403 |
| 30 | ATUALIZACAO-07 | 403 |

**Atenção:** `ATUALIZACAO-06` utiliza uma tarefa criada na equipe 3 em uma URL da equipe 4. Dependendo da ordem das verificações no backend, o resultado pode ser `404` em vez de `403`. Conferir a implementação antes de considerar uma divergência como defeito.

### Etapa 7 — Validações

| Ordem | Teste | Esperado |
|---|---|---|
| 31 | VALIDACAO-01 | 400 |
| 32 | VALIDACAO-02 | 400 |
| 33 | VALIDACAO-03 | 400 |

### Etapa 8 — Permissões de exclusão

| Ordem | Teste | Esperado |
|---|---|---|
| 34 | PERMISSAO-01 | 403 |
| 35 | PERMISSAO-02 | 403 |
| 36 | PERMISSAO-03 | 403 |

**Atenção:** `PERMISSAO-03` também utiliza uma tarefa de outra equipe na URL da equipe 4; confirmar se o contrato retorna `403` ou `404`.

### Etapa 9 — Exclusões

| Ordem | Teste | Esperado |
|---|---|---|
| 37 | EXCLUSAO-01 | 204 |
| 38 | EXCLUSAO-02 | 404 |
| 39 | EXCLUSAO-03 | 204 |
| 40 | EXCLUSAO-04 | 204 |
| 41 | EXCLUSAO-05 | 404 |
| 42 | EXCLUSAO-06 | 204 |
| 43 | EXCLUSAO-07 | 404 |

## Cuidados

- Executar todas as criações necessárias antes das consultas.
- Não executar exclusões antes dos testes de atualização.
- Após uma exclusão, repetir testes anteriores pode resultar em `404`.
- Para repetir a bateria completa, executar novamente as criações.
- Confirmar os vínculos dos usuários antes de interpretar respostas `403` e `404`.

## Critério de aprovação

Os cenários devem retornar os códigos previstos, respeitando os contratos reais da API e as pré-condições de participação e cargo.