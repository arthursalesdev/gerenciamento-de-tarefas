# Roteiro de Testes — Autenticação

**Arquivo de requisições:** `backend/requests/auth.http`

## Objetivo

Validar o cadastro, o login, a consulta do usuário autenticado e o
tratamento de dados, credenciais e tokens inválidos.

## Pré-condições

- A API e o banco de dados devem estar em execução.
- Use dados de teste, sem senhas reais.
- Para cadastrar um usuário novo, o e-mail e o nome de usuário precisam
  estar disponíveis.
- Para testar dados duplicados, o usuário correspondente já precisa
  existir no banco.

## Cadastro

| Cenário | Resultado esperado |
| --- | --- |
| Cadastro com dados válidos | `201` |
| Cadastro com e-mail já utilizado | `409` |
| Cadastro com nome de usuário já utilizado | `409` |
| Cadastro sem nome | `400` |
| Cadastro com nome de usuário inválido | `400` |

O cadastro exige **nome**, **nome de usuário**, **e-mail** e **senha**.
A senha deve ter no mínimo seis caracteres.

O nome de usuário deve ter de 3 a 50 caracteres, utilizando letras,
números ou sublinhado (`_`). O sistema normaliza esse valor para
minúsculas antes de verificar se já existe.

## Login

| Cenário | Resultado esperado |
| --- | --- |
| Login com nome de usuário e senha válidos | `200` |
| Login com e-mail e senha válidos | `200` |
| Login com credenciais inválidas | `401` |
| Login sem senha | `400` |

O campo `identificador` aceita o e-mail ou o nome de usuário. A API
também aceita o campo `email` por compatibilidade.

## Usuário autenticado

| Cenário | Resultado esperado |
| --- | --- |
| Consulta com token válido | `200` |
| Consulta sem token | `401` |
| Consulta com token inválido | `401` |

Execute um dos logins válidos antes da consulta autenticada, pois ela
utiliza o token retornado pela requisição de login.

## Cuidados

- Ajuste os usuários e as credenciais dos exemplos ao seu banco de
  testes.
- Repetir um cadastro com o mesmo e-mail ou nome de usuário pode
  retornar `409`.
- No teste de e-mail duplicado, use um nome de usuário disponível para
  isolar o cenário.
- Para confirmar que o nome de usuário não diferencia maiúsculas de
  minúsculas, o usuário usado no teste precisa estar cadastrado
  previamente.
- Confira os comentários e os resultados esperados em `auth.http`
  antes de executar cada requisição.