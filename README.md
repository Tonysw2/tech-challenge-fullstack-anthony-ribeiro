# Todo App — Desafio Técnico Fullstack

Sistema de gestão de tarefas com autenticação JWT. Monorepo com backend em Fastify e frontend em React.

## Stack

**Backend**

- [Fastify](https://fastify.dev/) — framework HTTP
- [Prisma](https://www.prisma.io/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — banco de dados
- [Zod](https://zod.dev/) — validação de schemas
- [Vitest](https://vitest.dev/) — testes

**Frontend**

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router v7](https://reactrouter.com/)
- [TanStack Query v5](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Pré-requisitos

- Node.js 22+
- pnpm 10+
- Docker (para o PostgreSQL)

## Executando o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/anthony-ribeiro/tech-challenge-fullstack-anthony-ribeiro.git
cd tech-challenge-fullstack-anthony-ribeiro
```

### 2. Backend

```bash
cd api
cp .env.example .env
docker compose up -d   # sobe o PostgreSQL
pnpm i
pnpm db:generate
pnpm db:migrate:dev
pnpm dev
```

API disponível em `http://localhost:3333`

### 3. Frontend

```bash
cd app
cp .env.example .env
pnpm install
pnpm dev
```

Aplicação disponível em `http://localhost:5173`

## Variáveis de ambiente

### API (`api/.env`)

| Variável                       | Descrição                           | Padrão                  |
| ------------------------------ | ----------------------------------- | ----------------------- |
| `DATABASE_URL`                 | URL de conexão com PostgreSQL       | —                       |
| `JWT_SECRET`                   | Secret para assinar access tokens   | —                       |
| `JWT_REFRESH_TOKEN_SECRET`     | Secret para assinar refresh tokens  | —                       |
| `JWT_ACCESS_TOKEN_EXPIRES_IN`  | Tempo de expiração do access token  | `15m`                   |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | Tempo de expiração do refresh token | `7d`                    |
| `CORS_ORIGIN`                  | Origem permitida no CORS            | `http://localhost:5173` |

### Frontend (`app/.env`)

| Variável       | Descrição       | Padrão                  |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | URL base da API | `http://localhost:3333` |

## Rotas da API

| Método | Rota             | Auth | Descrição                             |
| ------ | ---------------- | ---- | ------------------------------------- |
| POST   | `/sign-up`       | —    | Cadastro de usuário                   |
| POST   | `/sign-in`       | —    | Login                                 |
| POST   | `/refresh-token` | —    | Renovar access token                  |
| GET    | `/me`            | JWT  | Perfil do usuário autenticado         |
| GET    | `/tasks`         | JWT  | Listar tarefas (paginação por cursor) |
| POST   | `/tasks`         | JWT  | Criar tarefa                          |
| PATCH  | `/tasks/:id`     | JWT  | Atualizar tarefa                      |
| DELETE | `/tasks/:id`     | JWT  | Excluir tarefa                        |

## Testes

```bash
cd api
pnpm test
```

A suíte cobre testes unitários dos use cases (com repositórios em memória) e testes e2e dos controllers com banco de dados isolado por teste.

## CI

GitHub Actions executa em todo push e PR para `main`:

- **API**: typecheck, lint (Biome), testes com PostgreSQL real
- **Frontend**: typecheck, lint, build

## Deploy em produção

**Backend** — plataformas como Railway, Render ou Fly.io:

1. Configurar as variáveis de ambiente no painel da plataforma
2. Gerar o client Prisma: `pnpm exec prisma generate`
3. Rodar as migrations antes de iniciar: `pnpm exec prisma migrate deploy`
4. Iniciar o servidor: `node src/server.ts` via tsx ou compilar com `tsc` e rodar com `node`

**Frontend** — plataformas como Vercel ou Netlify:

1. Definir `VITE_API_URL` apontando para a URL da API em produção
2. Build command: `pnpm build`
3. Output directory: `dist`

**Banco de dados** — usar uma instância gerenciada (ex: Supabase, Neon, Railway Postgres) e fornecer a connection string como `DATABASE_URL`.

## Perguntas técnicas

### 1. O que mudaria para escalar para milhares de usuários?

Usaria Redis para cachear as listagens de tarefas, que tendem a ser as requisições mais frequentes e podem se tornar um gargalo no banco. Com a API sendo stateless graças ao JWT, escalar horizontalmente com múltiplas instâncias e um load balancer na frente é direto. Adicionaria rate limiting nos endpoints públicos mais sensíveis, especialmente o `/sign-in`, para evitar força bruta. E observabilidade — APM como Sentry ou Datadog — para identificar gargalos antes que virem incidentes.

### 2. Como executaria migrations em produção com segurança?

Usando `prisma migrate deploy` (não `migrate dev`) no pipeline de CI/CD, **antes** de fazer o deploy da nova versão da aplicação:

1. Validar as migrations em um ambiente de homologação (staging) que espelhe a produção
2. Fazer um backup do banco de produção
3. Rodar as migrations no banco de produção
4. Verificar se migraram com sucesso
5. Só então fazer o deploy da nova versão da API

Isso garante que o banco já está atualizado quando a nova versão do código entrar, e o backup permite reverter rapidamente caso algo dê errado.

### 3. Qual CI mínima considera ideal para este projeto?

A CI atual cobre o essencial:

- **Typecheck**: garante que o TypeScript está correto
- **Lint**: Biome para consistência de código
- **Testes**: unitários + e2e da API com banco real
- **Build**: garante que o frontend compila sem erro

O próximo passo natural seria adicionar **deploy automático** (CD) acionado após a CI passar na branch `main`.

### 4. Qual foi o principal trade-off adotado e por quê?

O principal trade-off foi usar **paginação por cursor** em vez de paginação por offset.

**Vantagem**: a listagem é consistente — se uma tarefa for criada ou removida enquanto o usuário pagina, ele não vê duplicatas nem pula itens. Além disso, o modelo se encaixa naturalmente em infinite scroll, que oferece uma experiência melhor em mobile do que navegação por páginas numeradas.

**Custo**: não é possível navegar para uma página arbitrária. A UI fica limitada ao padrão "carregar mais", o que pode ser uma restrição dependendo do produto.

A escolha foi deliberada: para uma lista de tarefas pessoais acessada principalmente em mobile, infinite scroll faz mais sentido do que paginação tradicional.
