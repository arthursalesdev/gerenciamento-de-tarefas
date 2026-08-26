# Gerenciamento de Tarefas

Sistema de gerenciamento de tarefas desenvolvido como atividade acadêmica, utilizando uma arquitetura em camadas e padrões de projeto para organizar as responsabilidades da aplicação.

O sistema permite autenticação de usuários e gerenciamento de tarefas, garantindo que cada usuário tenha acesso apenas às suas próprias tarefas.

## Tecnologias

### Backend

- Node.js
- Express
- Drizzle ORM
- PostgreSQL
- JWT
- bcrypt

### Frontend (Em Desenvolvimento)

- React
- Vite

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL em container
- Docker Volume para persistência dos dados

## Arquitetura

O backend foi organizado utilizando MVC e outros padrões para separar as responsabilidades da aplicação.

```text
backend/
├── drizzle/
│   └── migrations/
│
├── src/
│   ├── controllers/
│   ├── database/
│   │   └── schemas/
│   ├── dtos/
│   ├── errors/
│   ├── mappers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── .dockerignore
├── .env.example
├── Dockerfile
├── drizzle.config.js
├── package.json
└── package-lock.json
```

### Responsabilidades

- **Schemas:** Definem a estrutura das tabelas do banco.
- **Controllers:** Recebem as requisições HTTP e encaminham para a lógica da aplicação.
- **DTOs:** Controlam e validam os dados que entram e saem da aplicação.
- **Mappers:** Convertem dados entre diferentes formatos ou modelos.
- **Errors:** Definem erros personalizados da API.
- **Middlewares:** Executam verificações durante o fluxo das requisições, como autenticação e tratamento de erros.
- **Repositories:** Concentram as operações de acesso ao banco através do ORM.
- **Routes:** Definem os endpoints da API.
- **Services:** Concentram as regras de negócio e coordenam a lógica da aplicação.
- **Migrations:** Armazenam o histórico das alterações estruturais do banco.

## Funcionalidades

- Cadastro de usuários
- Login e autenticação com JWT
- Senhas armazenadas utilizando hash com bcrypt
- Criação de tarefas
- Listagem de tarefas
- Busca de tarefa por ID
- Atualização de tarefas
- Exclusão lógica (soft delete)
- Associação de tarefas ao usuário autenticado
- Isolamento das tarefas entre usuários
- Validação dos dados de entrada
- Registro de logs das operações realizadas nas tarefas
- Tratamento centralizado de exceções

## API

A API implementa os principais métodos HTTP:

| Método | Operação |
| --- | --- |
| GET | Consultar tarefas |
| POST | Criar recursos e autenticar usuários |
| PUT | Atualizar tarefas |
| DELETE | Excluir tarefas |

As rotas de tarefas são protegidas por autenticação JWT.

Cada tarefa pertence a um usuário, portanto um usuário autenticado não consegue consultar, alterar ou excluir tarefas pertencentes a outro usuário.

## Banco de Dados

O projeto utiliza PostgreSQL através do Drizzle ORM.

As principais tabelas são:

```text
usuarios
   │
   │ 1:N
   ▼
tarefas
   │
   │ 1:N
   ▼
logs_tarefas
```

As alterações estruturais do banco são controladas através das migrations do Drizzle.

## Docker

O ambiente Docker utiliza dois containers:

```text
┌──────────────────────┐
│         API          │
│ Node.js + Express    │
│ Drizzle ORM          │
└──────────┬───────────┘
           │
           │ postgres:5432
           ▼
┌──────────────────────┐
│     PostgreSQL       │
│    PostgreSQL 13     │
└──────────┬───────────┘
           │
           ▼
     postgres_data
    (Docker Volume)
```

O Docker Compose é responsável por criar e conectar os serviços.

O PostgreSQL possui um `healthcheck`, e a API aguarda o banco estar disponível antes de iniciar.

## Persistência dos dados

Os dados do PostgreSQL são armazenados no volume:

```text
postgres_data
```

Dessa forma, executar:

```bash
docker compose down
```

remove os containers, mas mantém os dados do banco.

Para remover também o volume e seus dados:

```bash
docker compose down -v
```

> Atenção: o comando acima remove permanentemente os dados armazenados no volume.

## Configuração

Antes de iniciar o projeto, copie o arquivo:

```text
.env.example
```

para:

```text
.env
```

E configure as variáveis necessárias:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=gerenciamento_tarefas
JWT_SECRET=sua_chave_secreta
```

O arquivo `.env` não deve ser enviado para o GitHub.

## Executando com Docker

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Esse comando constrói a imagem da API e inicia os containers da API e do PostgreSQL em segundo plano.

Para verificar os containers:

```bash
docker ps
```

O PostgreSQL deve aparecer com o status:

```text
healthy
```

## Migrations

Com os containers em execução, aplique as migrations:

```bash
docker compose exec api npm run db:migrate
```

Isso cria ou atualiza a estrutura das tabelas no PostgreSQL do container.

## Portas

| Serviço | Endereço |
| --- | --- |
| API | `localhost:3000` |
| PostgreSQL local | `localhost:5432` |
| PostgreSQL Docker | `localhost:5433` |

Dentro da rede do Docker, a API acessa o banco através de:

```text
postgres:5432
```

A porta `5433` é utilizada somente para acessar o PostgreSQL do container a partir do computador, por exemplo através do DBeaver.

## Comandos Docker úteis

Subir os containers:

```bash
docker compose up -d
```

Reconstruir a imagem e subir os containers:

```bash
docker compose up -d --build
```

Parar os containers sem removê-los:

```bash
docker compose stop
```

Parar e remover os containers:

```bash
docker compose down
```

Validar a configuração do Docker Compose:

```bash
docker compose config
```

Executar as migrations:

```bash
docker compose exec api npm run db:migrate
```

Verificar os containers em execução:

```bash
docker ps
```

## Fluxo da aplicação

De forma simplificada, uma requisição protegida percorre o seguinte fluxo:

```text
Requisição HTTP
      ↓
Route
      ↓
Middleware de autenticação
      ↓
Controller
      ↓
Service
      ↓
DTO / Regras de negócio
      ↓
Repository
      ↓
Drizzle ORM
      ↓
PostgreSQL
```

Na resposta, os dados podem passar pelo Mapper e pelo DTO de resposta antes de serem devolvidos ao cliente.

## Autor

**Arthur Sales**