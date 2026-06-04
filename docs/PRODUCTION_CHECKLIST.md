# Production Checklist

## Security

- [ ] `JWT_SECRET` rotated; not default
- [ ] `AUTH_COOKIE_SECURE=true` behind HTTPS
- [ ] `CORS_ORIGIN` limited to production domains
- [ ] Helmet + rate limiting enabled (API)
- [ ] MySQL not exposed publicly
- [ ] Seed/demo passwords changed

## Data

- [ ] `prisma migrate deploy` on production DB
- [ ] Backups scheduled for MySQL
- [ ] `SEED_ADMIN_PASSWORD` not used in production (create real users)

## App

- [ ] `pnpm build` passes in CI
- [ ] API + Web health checks monitored
- [ ] Email provider wired for password reset (replace dev `resetUrl`)

## RBAC

- [ ] Roles reviewed (`docs/ROLE_PERMISSION_MATRIX.md`)
- [ ] 403 page tested for unauthorized admin routes
