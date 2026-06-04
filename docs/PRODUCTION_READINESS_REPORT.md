# Production Readiness Report

**تاريخ:** 2026-06-05  
**نطاق:** Corporate Website + CMS (post restructure)

## مكتمل ✅

| معيار                                | الحالة                        |
| ------------------------------------ | ----------------------------- |
| 3 أدوار فقط                          | ✅ super-admin, admin, editor |
| حذف التوظيف                          | ✅ DB + API + Web             |
| إخفاء روابط الإدارة من الموقع العام  | ✅                            |
| Redirect حسب الدور                   | ✅ admin vs editor            |
| RBAC على routes/middleware/gates/nav | ✅                            |
| بيانات من MySQL (لا mock)            | ✅                            |
| `pnpm --filter @umq/web build`       | ✅                            |
| `pnpm --filter @umq/api check-types` | ✅                            |
| Migration applied                    | ✅                            |

## جزئي ⚠️

| معيار             | ملاحظة                                                                  |
| ----------------- | ----------------------------------------------------------------------- |
| CMS admin UI كامل | testimonials/media موجودة؛ settings/SEO/team/partners تحتاج صفحات admin |
| `pnpm lint` (جذر) | تحذير قديم في `packages/database/scripts/migrate-from-omq.ts`           |
| Test coverage     | minimal — لم يُطلب 80% في هذه المرحلة                                   |
| Email reset       | dev فقط                                                                 |

## خطوات النشر

```bash
pnpm install
pnpm --filter @umq/shared build
pnpm db:migrate
pnpm db:seed
pnpm build
pnpm dev
```

**اختبار:**

- عام: `/ar` — لا login في الهيدر
- super-admin: `/ar/login` → `admin@umq.sa` → `/ar/admin`
- editor: `editor@umq.sa` → `/ar/editor`
