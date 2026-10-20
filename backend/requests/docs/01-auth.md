# Roteiro de Testes — Autenticação

**Arquivo:** `auth.http`

## Objetivo

Validar cadastro, login, consulta do usuário autenticado e tratamento de credenciais ou tokens inválidos.

## Ordem recomendada

| Ordem | Cenário | Esperado |
|---|---|---|
| 1 | Cadastro de usuário válido | 201 |
| 2 | Login com credenciais válidas | 200 |
| 3 | Consultar usuário autenticado (`/auth/me`) | 200 |
| 4 | Login com senha incorreta | 401 |
| 5 | Login sem senha | 400 |
| 6 | Consulta sem token | 401 |
| 7 | Consulta com token inválido | 401 |
| 8 | Cadastro com e-mail duplicado | 409 |
| 9 | Cadastro sem nome | 400 |

## Dependências

O login válido deve ser executado antes da consulta autenticada, pois a requisição utiliza o token retornado.

O teste de e-mail duplicado depende de um usuário previamente cadastrado.

## Cuidados

- Utilizar um e-mail de teste para novos cadastros.
- Repetir o cadastro com o mesmo e-mail pode produzir `409`, mesmo quando o teste original esperava `201`.
- Não incluir senhas reais diretamente no arquivo `.http`.
- Confirmar que os códigos retornados correspondem aos contratos implementados na API.

## Identificadores

Os identificadores exatos `AUTH-01`, `VALIDACAO-01` etc. devem ser conferidos no `auth.http` definitivo. A sequência acima representa os nove cenários previstos na revisão, sem presumir nomes de blocos que não foram confirmados.