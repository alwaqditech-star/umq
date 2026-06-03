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
- Docker (for PostgreSQL)

## Quick start

```bash
pnpm install
docker compose up -d
pnpm --filter @umq/database db:migrate
pnpm --filter @umq/database db:seed
pnpm dev
```
