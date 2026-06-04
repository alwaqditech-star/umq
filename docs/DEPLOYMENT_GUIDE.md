# UMQ Platform — Deployment Guide

## Prerequisites

- Node.js 20+, pnpm 9+
- MySQL 8+ (or MariaDB 10.6+)
- Reverse proxy with TLS (nginx / Caddy) for production

## Environment

Copy `.env.example` to `.env` and set:

| Variable | Production |
|----------|------------|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Strong random secret |
| `AUTH_COOKIE_SECURE` | `true` |
| `CORS_ORIGIN` | `https://your-domain.com` |
| `WEB_ORIGIN` | Public site URL |
| `NEXT_PUBLIC_API_URL` | `/api/v1` (same-origin) or full API URL |
| `API_INTERNAL_URL` | Internal Nest URL for SSR |

## Build

```bash
pnpm install
pnpm db:generate
pnpm --filter @umq/database exec dotenv -e ../../.env -- prisma migrate deploy
pnpm db:seed
pnpm --filter @umq/shared build
pnpm build
```

## Run

```bash
# API
pnpm --filter @umq/api start:prod

# Web
pnpm --filter @umq/web start
```

## Docker MySQL

```bash
docker compose up -d mysql
# Use DATABASE_URL port 3307 per .env.example
```

## Health check

`GET /api/v1/health` — must return 200 before routing traffic.
