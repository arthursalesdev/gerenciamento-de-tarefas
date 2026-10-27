# TaskFlow

O TaskFlow é um sistema de gerenciamento de tarefas pessoais e de equipes. Ele reúne tarefas, prazos, responsáveis e indicadores em um só lugar, com autenticação e controle de acesso por cargo.

O projeto foi desenvolvido como atividade acadêmica, com foco na organização das responsabilidades da aplicação.

## Funcionalidades

### Conta e autenticação

- Cadastro e login com e-mail ou nome de usuário.
- Autenticação com JWT e senhas armazenadas como hash com bcrypt.
- Consulta ao perfil e identificação por nome de usuário e tag.
- Alternância entre temas claro e escuro.

### Tarefas pessoais

- Criar, consultar, editar e excluir tarefas.
- Organizar atividades por status, prioridade e prazo.
- Acompanhar indicadores no painel.
- Registrar operações em logs e utilizar exclusão lógica.

### Equipes

- Criar equipes e convidar pessoas pelo nome de usuário e tag.
- Aceitar ou recusar convites recebidos.
- Gerenciar membros e cargos conforme as permissões disponíveis.
- Criar tarefas compartilhadas e atribuir responsáveis.
- Transferir a propriedade da equipe e acompanhar indicadores no painel.

Os cargos são **dono**, **líder**, **membro** e **visualizador**. As ações disponíveis dependem do cargo e das regras da API. O criador se torna dono da equipe; novos integrantes entram por convite.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Front-end | React, Vite, Material UI, React Router e Axios |
| Back-end | Node.js, Express, Drizzle ORM, JWT e bcrypt |
| Banco de dados | PostgreSQL |
| Infraestrutura | Docker e Docker Compose |
| Documentação da API | Swagger UI |

## Estrutura do projeto

```text
gerenciamento-de-tarefas/
├── backend/
│   ├── drizzle/migrations/  # Alterações no banco
│   ├── requests/            # Exemplos de requisições
│   └── src/
│       ├── controllers/     # Comunicação HTTP
│       ├── database/        # Conexão e schemas
│       ├── dtos/            # Validação e organização dos dados
│       ├── errors/          # Erros personalizados
│       ├── mappers/         # Conversão de respostas
│       ├── middlewares/     # Autenticação e tratamento de erros
│       ├── repositories/    # Acesso ao banco
│       ├── routes/          # Rotas da API
│       └── services/        # Regras de negócio
├── frontend/
│   └── src/
│       ├── components/      # Componentes da interface
│       ├── context/         # Estados e operações compartilhados
│       ├── pages/           # Páginas da aplicação
│       ├── routes/          # Proteção de rotas
│       ├── services/        # Configuração da API
│       └── theme/           # Configuração visual
├── docker-compose.yml
└── README.md
```

## Como executar localmente

As instruções abaixo usam **Docker para a API e o PostgreSQL** e executam o front-end localmente. O Docker Compose não inicia o front-end.

### Pré-requisitos

- Git.
- Docker e Docker Compose em funcionamento.
- Node.js e npm compatíveis com as dependências do front-end.

### 1. Clone o repositório

```bash
git clone https://github.com/arthursalesdev/gerenciamento-de-tarefas.git
cd gerenciamento-de-tarefas
git checkout develop
```

### 2. Configure as variáveis do Docker

Na raiz do projeto, copie `.env.example` para um arquivo chamado `.env`. No PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite o novo `.env` e defina os valores:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=gerenciamento_tarefas
JWT_SECRET=uma_chave_secreta_para_seu_ambiente
```

Não envie o arquivo `.env` ao repositório. As variáveis acima são usadas pelo Docker Compose; `backend/.env.example` é destinado à execução da API fora do Docker.

### 3. Inicie a API e o banco

Na raiz do projeto:

```bash
docker compose up -d --build
docker compose ps
```

O Compose aguarda o PostgreSQL ficar disponível antes de iniciar a API. Na primeira execução, e quando houver novas migrations, aplique-as:

```bash
docker compose exec api npm run db:migrate
```

### 4. Inicie o front-end

Em outro terminal, a partir da raiz:

```bash
cd frontend
npm ci
npm run dev
```

Abra o endereço apresentado no terminal do Vite, normalmente `http://localhost:5173`.

| Serviço | Endereço local padrão |
| --- | --- |
| Front-end | `http://localhost:5173` |
| API | `http://localhost:3000` |
| Documentação Swagger | `http://localhost:3000/api-docs` |
| PostgreSQL do Docker | `localhost:5433` |

O front-end usa `http://localhost:3000` como endereço padrão da API. O back-end está configurado para permitir requisições de `http://localhost:5173`; se essas portas mudarem, ajuste a configuração correspondente.

### Encerrar o ambiente

Na raiz, para parar e remover os containers:

```bash
docker compose down
```

Os dados do PostgreSQL permanecem no volume `postgres_data`. O comando `docker compose down -v` também remove o volume e seus dados.

## Fluxo da aplicação

Uma requisição à API passa pelas rotas, pelos middlewares necessários e pelo controller. O controller chama o service, que aplica as regras de negócio e usa os repositories para acessar o banco. DTOs e mappers ajudam a validar e organizar os dados.

O front-end utiliza Axios para chamar a API e contexts para compartilhar estados e operações entre componentes. As rotas protegidas exigem autenticação.

## API e exemplos

Com a API em execução, acesse `http://localhost:3000/api-docs` para consultar o Swagger. Há exemplos adicionais em `backend/requests/`.

**Observação:** a documentação Swagger e alguns exemplos ainda precisam ser revisados para refletir todas as alterações recentes, incluindo autenticação e o fluxo de convites.

## Estado atual

O projeto está em evolução. A tela **Meu perfil** permite consultar os dados da conta; a edição ainda não está disponível. Os convites recebidos são carregados ao iniciar a sessão ou atualizar a página.

## Autor

**Arthur Sales**
