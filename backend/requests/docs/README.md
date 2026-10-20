# Guia de Execução dos Testes da API

## Objetivo

Documentar a ordem de execução dos testes manuais da API TaskFlow utilizando a extensão REST Client do VS Code.

## Ordem geral

| Ordem | Arquivo | Objetivo |
|---|---|---|
| 1 | `auth.http` | Validar cadastro, login e autenticação |
| 2 | `tarefas.http` | Validar tarefas individuais e de equipe |
| 3 | `equipes.http` | Validar equipes, propriedade e exclusão em cascata |
| 4 | `membros.http` | Validar membros, cargos, permissões e saída |

## Preparação

1. Iniciar a API e verificar a conexão com o banco.
2. Confirmar as variáveis de autenticação no `.vscode/settings.json`.
3. Confirmar os IDs e cargos dos usuários de teste.
4. Executar as requisições de login de cada arquivo antes das demais.
5. Respeitar a ordem indicada nos guias específicos.

## Estado inicial esperado

| Usuário | ID | Equipe 2 | Equipe 3 |
|---|---|---|---|
| Arthur | 1 | DONO | DONO |
| João | 2 | LIDER | MEMBRO |
| Maria | 3 | VISUALIZADOR | Não definido |

João também deve estar fora da equipe 4 para os testes de acesso externo.

Esses valores são pré-condições baseadas nos cenários de teste, não uma confirmação do estado atual do banco.

## Regras importantes

- Executar primeiro as requisições nomeadas com `# @name`.
- Não executar exclusões antes dos testes que dependem dos registros.
- Evitar repetir criações sem verificar os registros existentes.
- Executar transferências de propriedade e devoluções em sequência.
- Não remover Maria antes de concluir os testes de tarefas que exigem sua participação.
- Registrar qualquer divergência entre o status esperado e o retornado.

## Registro de resultados

| Teste | Esperado | Obtido | Resultado |
|---|---|---|---|
| Exemplo: AUTH-01 | 200 | — | Pendente |

Classificações: **Aprovado**, **Falhou**, **Bloqueado** ou **Não executado**.

## Critério de conclusão

A bateria estará concluída quando todos os cenários aplicáveis tiverem sido executados, as divergências tiverem sido investigadas e os dados necessários para novos testes estiverem restaurados.