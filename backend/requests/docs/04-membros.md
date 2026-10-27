# Roteiro de Testes — Membros de Equipe

**Arquivo de requisições:** `backend/requests/membros.http`

## Objetivo

Validar a entrada de membros por convite, a consulta dos integrantes,
as alterações de cargo, a transferência de propriedade e as regras de
saída e remoção de membros.

## Pré-condições

Antes de iniciar, confira os IDs e as credenciais configurados no
`membros.http`. Os exemplos abaixo usam:

- Arthur, ID `1`, como **DONO** da equipe.
- João, ID `2`, como **LIDER** da equipe.
- Maria, ID `3`, com uma conta cadastrada.
- Equipe com ID `2`.

Para iniciar os testes de convite, Maria deve estar **fora da equipe** e
não pode ter um convite pendente para ela.

> Os testes alteram o estado da equipe. Use um ambiente de testes e
> execute as requisições na ordem indicada.

## 1. Autenticação e consulta

| Teste | Cenário | Resultado esperado |
| --- | --- | --- |
| `AUTH-01` | Login como dono | `200` |
| `AUTH-02` | Login como líder | `200` |
| `AUTH-03` | Login como Maria | `200` |
| `MEM-01` | Listar membros da equipe | `200` |

Execute os três logins antes dos demais testes. As requisições seguintes
utilizam os tokens retornados por eles.

## 2. Entrada por convite

| Teste | Cenário | Resultado esperado |
| --- | --- | --- |
| `CONVITE-01` | Dono envia convite para Maria | `201` |
| `CONVITE-02` | Tentar enviar outro convite pendente | `409` |
| `CONVITE-03` | Maria aceita o convite | `200` |

Execute `CONVITE-02` antes de `CONVITE-03`, enquanto o primeiro convite
ainda está pendente.

O teste de aceite utiliza o ID retornado por `CONVITE-01`. Após o aceite,
Maria deve aparecer como **MEMBRO** da equipe.

## 3. Alteração de cargos

| Teste | Cenário | Resultado esperado |
| --- | --- | --- |
| `CARGO-01` | Dono promove Maria a líder | `200` |
| `CARGO-02` | Dono altera Maria para membro | `200` |
| `PERM-01` | Líder tenta alterar o cargo do dono | `403` |
| `PERM-02` | Líder altera Maria para visualizador | `200` |
| `PERM-03` | Visualizador tenta alterar o cargo do líder | `403` |
| `PERM-04` | Líder tenta alterar o próprio cargo | `400` |
| `PERM-05` | Dono tenta atribuir o cargo DONO diretamente | `400` |

Após `PERM-02`, Maria deve estar com o cargo **VISUALIZADOR**. Esse
estado é necessário para o teste `PERM-03`.

## 4. Transferência de propriedade

| Teste | Cenário | Resultado esperado |
| --- | --- | --- |
| `PROP-01` | Arthur transfere a propriedade para João | `200` |
| `PROP-02` | João devolve a propriedade para Arthur | `200` |

Execute os dois testes em sequência. Ao final, Arthur deve voltar a ser
**DONO** e João deve ser **LIDER**.

## 5. Saída e remoção

Execute esta etapa por último.

| Teste | Cenário | Resultado esperado |
| --- | --- | --- |
| `SAIDA-01` | Dono tenta sair da própria equipe | `403` |
| `SAIDA-02` | Maria sai voluntariamente | `204` |
| `PERMISSAO-01` | Líder tenta remover o dono | `403` |
| `CONVITE-04` | Líder envia novo convite para Maria | `201` |
| `CONVITE-05` | Maria aceita o novo convite | `200` |
| `PERMISSAO-03` | Líder remove Maria da equipe | `204` |

O teste `CONVITE-05` utiliza o ID retornado por `CONVITE-04`.
Execute-o antes de `PERMISSAO-03`, pois Maria precisa estar novamente na
equipe para ser removida.

## Estado final esperado

- Arthur continua como **DONO**.
- João continua como **LIDER**.
- Maria não participa da equipe.

Para repetir a bateria, confirme o estado da equipe e dos convites antes
de começar. Para outros testes que exijam Maria na equipe, envie um novo
convite e aceite-o com a conta dela.

## Cuidados

- Não coloque senhas reais diretamente no arquivo de requisições.
- Os IDs e usuários são exemplos; ajuste-os ao banco de testes.
- Não repita um convite esperando `201` se já houver outro pendente para a mesma pessoa e equipe.
- A execução dos testes de cargo, saída e remoção depende do estado produzido pelas requisições anteriores.