# CURRENT STATUS — UMQ Platform

**آخر تحديث:** 2026-06-05 — RBAC simplification + recruitment removal

## Snapshot

| Item | Value |
|------|--------|
| نوع المنصة | Corporate Website + CMS |
| الأدوار | `super-admin`, `admin`, `editor` (3 فقط) |
| لوحات التحكم | `/admin` (super-admin, admin), `/editor` (editor) |
| الدخول العام | **مخفي** — `/ar/login` فقط |
| Database | MySQL `umq_platform` |
| Data | NestJS → Prisma → MySQL (no mock) |

## ما تم حذفه

- نظام التوظيف (jobs, applications, careers)
- أدوار: hr, viewer, manager, employee, customer
- بوابة العميل `/customer`
- أزرار Login/Dashboard من الموقع العام

## حسابات تجريبية

Password: `SEED_ADMIN_PASSWORD` (default `ChangeMe123!`)

| Email | Role | بعد Login |
|-------|------|-----------|
| admin@umq.sa | super-admin | `/ar/admin` |
| operations@umq.sa | admin | `/ar/admin` |
| editor@umq.sa | editor | `/ar/editor` |

## توثيق

- [`RBAC_RESTRUCTURE_PLAN.md`](./RBAC_RESTRUCTURE_PLAN.md)
- [`RBAC_FINAL_REPORT.md`](./RBAC_FINAL_REPORT.md)
- [`SECURITY_NAVIGATION_AUDIT.md`](./SECURITY_NAVIGATION_AUDIT.md)
- [`REMOVED_MODULES_REPORT.md`](./REMOVED_MODULES_REPORT.md)
- [`PRODUCTION_READINESS_REPORT.md`](./PRODUCTION_READINESS_REPORT.md)

## Verify

```bash
pnpm db:migrate
pnpm db:seed
pnpm --filter @umq/web build
pnpm --filter @umq/api check-types
```
