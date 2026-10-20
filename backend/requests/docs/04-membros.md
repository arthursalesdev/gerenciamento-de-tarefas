# Roteiro de Testes — Membros de Equipe

**Arquivo:** `membros.http`

## Pré-condições

- Arthur (ID 1) é DONO da equipe 2.
- João (ID 2) é LIDER da equipe 2.
- Maria (ID 3) possui cadastro válido.
- Maria deve estar fora da equipe 2 antes de `MEM-02`.
- Após `MEM-02`, Maria deve estar como MEMBRO para executar `CARGO-01`.

Este arquivo deve ser executado após `tarefas.http`, pois remove Maria da equipe utilizada nos testes de tarefas.

## Ordem de execução

### Etapa 1 — Autenticação

| Ordem | Teste | Esperado |
|---|---|---|
| 1 | AUTH-01 | 200 |
| 2 | AUTH-02 | 200 |
| 3 | AUTH-03 | 200 |

### Etapa 2 — Consulta e adição

| Ordem | Teste | Esperado |
|---|---|---|
| 4 | MEM-01 | 200 |
| 5 | MEM-02 | 201 |
| 6 | MEM-03 | 409 |

**Importante:** se Maria já estiver na equipe, `MEM-02` não poderá ser executado como teste de criação inédita sem uma preparação anterior.

### Etapa 3 — Alteração de cargos

| Ordem | Teste | Esperado |
|---|---|---|
| 7 | CARGO-01 | 200 |
| 8 | CARGO-02 | 200 |
| 9 | PERM-01 | 403 |
| 10 | PERM-02 | 200 |
| 11 | PERM-03 | 403 |
| 12 | PERM-04 | 400 |
| 13 | PERM-05 | 400 |

Após `PERM-02`, Maria deve estar como VISUALIZADOR.

### Etapa 4 — Validações

| Ordem | Teste | Esperado |
|---|---|---|
| 14 | VALIDACAO-01 | 400 |
| 15 | VALIDACAO-02 | 400 |
| 16 | VALIDACAO-03 | 400 |
| 17 | VALIDACAO-04 | 400 |
| 18 | VALIDACAO-05 | 400 |

### Etapa 5 — Transferência de propriedade

| Ordem | Teste | Esperado |
|---|---|---|
| 19 | PROP-01 | 200 |
| 20 | PROP-02 | 200 |

Executar em sequência. A segunda requisição deve devolver a propriedade a Arthur.

### Etapa 6 — Saída e remoção

| Ordem | Teste | Esperado |
|---|---|---|
| 21 | SAIDA-01 | 403 |
| 22 | SAIDA-02 | 204 |
| 23 | PERMISSAO-01 | 403 |
| 24 | PERMISSAO-02 | 201 |
| 25 | PERMISSAO-03 | 204 |

## Cuidados

- `SAIDA-02` remove Maria da equipe.
- `PERMISSAO-02` depende da saída de Maria para testar uma nova adição.
- `PERMISSAO-03` remove Maria novamente.
- Não repetir `MEM-02` após uma adição bem-sucedida esperando outro `201`.
- Os testes de alteração de cargo dependem do estado produzido pelas requisições anteriores.

## Estado final esperado

- Arthur continua DONO.
- João continua LIDER.
- Maria não participa da equipe 2.

## Preparação para repetir a bateria geral

Para executar novamente os testes de tarefas que exigem Maria como VISUALIZADOR, é necessário:

1. Adicionar Maria à equipe 2.
2. Alterar seu cargo para VISUALIZADOR.
3. Confirmar sua participação na listagem de membros.

Somente depois disso executar novamente os testes de tarefas.