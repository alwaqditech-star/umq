# UMQ Platform

عُمْق لتقنية المعلومات — Enterprise monorepo for public website, admin dashboard, and API.

## Structure

```
umq-platform/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js 15 public website
├── packages/
│   ├── database/     # Prisma schema & client
│   ├── shared/       # Shared types & constants
│   ├── ui/           # Shared React components
│   ├── eslint-config/
│   └── typescript-config/
├── docker/
└── .github/workflows/
```

## Prerequisites

- Node.js >= 20
- pnpm 9
- Docker (for MySQL)

## User interfaces (per analysis report)

| Interface | Route group | Audience |
|-----------|-------------|----------|
| Public website | `apps/web/app/[locale]/(public)` | Visitors, clients |
| Auth | `apps/web/app/[locale]/(auth)` | Staff login |
| Admin dashboard | `apps/web/app/[locale]/admin` | Super Admin, Editor, HR, Viewer (RBAC) |
| REST API | `apps/api` (`/api/v1`) | Web app + future integrations |

### Default roles (seeded)

- **super-admin** — full access
- **editor** — content (blog, projects, services)
- **hr** — jobs and applications
- **viewer** — read-only across modules

Default admin: `admin@umq.sa` / `ChangeMe123!` (override with `SEED_ADMIN_PASSWORD`).

## Quick start

```bash
pnpm install
docker compose up -d mysql
cp .env.example .env
# Docker MySQL listens on host port 3307 (3306 may already be in use locally)
pnpm --filter @umq/shared build
pnpm --filter @umq/database db:generate
pnpm --filter @umq/database db:migrate:deploy
pnpm --filter @umq/database db:seed
pnpm dev
```

- Web: http://localhost:3000/ar  
- API: http://localhost:4000/api/v1/health  

Set `NEXT_PUBLIC_API_MODE=http` and `NEXT_PUBLIC_API_URL` in `.env` to connect the UI to MySQL via NestJS (default in `.env.example`).

### Connect to an existing MySQL server

Update `.env` with your connection string:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/umq_platform"
```

Then run migrations and seed:

```bash
pnpm --filter @umq/database db:migrate
pnpm --filter @umq/database db:seed
```
