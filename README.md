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
| Admin dashboard | `apps/web/app/[locale]/admin` | Super Admin, Admin (RBAC) |
| Editor dashboard | `apps/web/app/[locale]/editor` | Editor (content only) |
| REST API | `apps/api` (`/api/v1`) | Web app + future integrations |

### Default roles (seeded)

- **super-admin** — full access (`/admin`)
- **admin** — CMS and content, no user/role management (`/admin`)
- **editor** — blog, projects, media (`/editor`)

Staff login is **not linked from the public website** — use `/ar/login` directly.

Default users (password from `SEED_ADMIN_PASSWORD`, default `ChangeMe123!`):

| Role | Email |
|------|-------|
| super-admin | `admin@umq.sa` |
| admin | `operations@umq.sa` |
| editor | `editor@umq.sa` |

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

Set `NEXT_PUBLIC_API_URL` in `.env` to connect the UI to MySQL via NestJS (required; mock mode removed).

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

### Legacy `omq_db` (phpMyAdmin / XAMPP dump)

The file `omq_db.sql` uses an **older schema** (integer IDs, single-language columns). The platform uses **`umq_platform`** with Prisma (UUIDs, bilingual fields). Both can live on the same MySQL server.

**XAMPP (already has `omq_db` or fresh import):**

```powershell
# Optional re-import from Downloads
.\scripts\import-omq-db.ps1 -SqlPath "$env:USERPROFILE\Downloads\omq_db.sql"

# App database + seed
pnpm --filter @umq/database db:migrate:deploy
pnpm --filter @umq/database db:seed

# Copy general_settings → settings (4 rows in default dump)
pnpm --filter @umq/database db:migrate-from-omq
```

`.env` for XAMPP (root, no password, port 3306):

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/umq_platform"
LEGACY_DATABASE_URL="mysql://root@127.0.0.1:3306/omq_db"
```
