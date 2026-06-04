# FINAL AUDIT — UMQ Platform (Production Completion Baseline)

**تاريخ:** 2026-06-04  
**المراجع الإلزامية:** `README.md`, `PROJECT_AUDIT.md`, `PHASES_STATUS.md`  
**ملاحظة:** `CURRENT_STATUS.md` **غير موجود** في المستودع — تم استبداله بتحديث هذا الملف و`PHASES_STATUS.md`.

**نطاق:** Workspace الحالي — NestJS + Next.js 15 + Prisma/MySQL (`umq_platform`)

---

## 0. ملخص تنفيذي

| البُعد | الحالة | Production Ready؟ |
|--------|--------|-------------------|
| MySQL + Prisma | ✅ يعمل | جزئي |
| Mock Data | ✅ **أُزيل** (Phase 2) — HTTP فقط | ✅ |
| Auth (Login/Refresh/Logout) | ✅ | ❌ بدون HttpOnly/Reset/Lockout |
| RBAC (4 أدوار seed) | ⚠️ ≠ 8 أدوار مطلوبة | ❌ |
| Admin CRUD (services/projects/blog/jobs/users) | ✅ HTTP | ⚠️ CMS ناقص |
| Public pages | ⚠️ قوائم فقط — لا detail routes | ❌ |
| Security | 🔴 | ❌ |
| Tests | 🔴 0% | ❌ |
| Docs إنتاج | 🔴 | ❌ |

**نسبة اكتمال تقديرية للمواصفات الكاملة:** ~35–40%

---

## 1. ما يعمل ✅

### 1.1 البنية
- Monorepo pnpm + turbo: `apps/api`, `apps/web`, `packages/database`, `@umq/shared`
- CI: lint, check-types, build (بدون tests)
- Docker MySQL + XAMPP `3306` مدعوم في `.env`

### 1.2 قاعدة البيانات
- 24 نموذج Prisma → MySQL `umq_platform`
- Migrations: `20250603120000_init_mysql`
- Seed: 4 أدوار، 4 مستخدمين، permissions، عينات محتوى
- FKs وindexes معرّفة في schema

### 1.3 API (NestJS `/api/v1`)
| Module | Public | Admin | CRUD |
|--------|--------|-------|------|
| Auth | login, refresh | me, logout | — |
| Users | — | list/CRUD | ✅ |
| Roles | — | read + permissions list | قراءة فقط |
| Services | list, by slug | full CRUD | ✅ |
| Projects | list, by slug | full CRUD | ✅ |
| Blog | list (?locale), by slug | full CRUD | ✅ |
| Jobs | list, apply | full CRUD | ✅ |
| Applications | — | list, get, status, notes | جزئي |
| Contacts | POST | list, get, PATCH status | جزئي |
| Testimonials | GET published | — | قراءة فقط |
| Health | GET | — | — |

### 1.4 Web — Next.js App Router
- i18n `ar` / `en`, middleware locale
- Public: home, about, services, projects, blog, careers, contact
- Auth: login, forgot-password (واجهة — API ناقص)
- Admin: dashboard, users, roles, services, projects, blog, jobs, applications, **contacts**
- RBAC UI: `AdminAuthGate`, `AdminPermissionGate`, sidebar ديناميكي
- Navbar: إخفاء لوحة التحكم عن الزائر
- Forms: `AdminFormModal` لمعظم الكيانات

### 1.5 Packages
- `@umq/shared`: password (scrypt), RBAC helpers (`canAccessAdminPanel`, `getDefaultAdminPath`)
- `@umq/database`: Prisma client, seed

---

## 2. ما لا يعمل / ناقص ❌

### 2.1 Mock Data — ✅ مُنجَز (Phase 2, 2026-06-04)
- ~~`lib/api/mock/*`, `mocks/*.ts`~~ **محذوف**
- `apps/web/lib/api/index.ts`: `httpApi` فقط + `assertApiConfigured()` لـ `NEXT_PUBLIC_API_URL`
- `about` page: نص ثابت (ليس mock API) — يُربط بـ Website Sections لاحقاً

### 2.2 Authentication
| ميزة | API | Web |
|------|-----|-----|
| Forgot password | DTO فقط | صفحة تستدعي endpoint غير موجود |
| Reset password | DTO فقط | لا صفحة |
| Change password | ❌ | ❌ |
| Remember Me | ❌ | ❌ |
| Account lockout (`lockedUntil`) | حقل DB فقط | ❌ |
| HttpOnly refresh cookie | ❌ JSON body | localStorage + `umq_access` readable |
| JWT في middleware | ❌ cookie presence فقط | — |

### 2.3 Authorization — فجوات RBAC
**مطلوب (المواصفات):** Super Admin, Admin, Manager, HR, Editor, Employee, Customer, Viewer  
**الموجود (seed):** `super-admin`, `editor`, `hr`, `viewer` فقط

| فجوة | التأثير |
|------|---------|
| لا Admin/Manager/Employee/Customer roles | dashboards وmatrix غير مكتملة |
| لا Customer portal | `/customer/*` غير موجود |
| لا صفحة 403 Forbidden | redirect فقط |
| Permissions في JWT قديمة | حتى refresh |
| `roles:manage` | permission بدون API/UI |
| `settings:manage`, `audit:read` | بدون modules |

### 2.4 Prisma models بدون API/UI

| Model | API | Admin UI | Public UI |
|-------|-----|----------|-----------|
| `team_members` | ❌ | ❌ | ❌ |
| `partners` | ❌ | ❌ | ❌ |
| `testimonials` | GET فقط | ❌ | home (HTTP) |
| `website_sections` | ❌ | ❌ | hero seed فقط |
| `seo_pages` | ❌ | ❌ | ❌ |
| `settings` | ❌ | ❌ | ❌ |
| `media_library` | ❌ | ❌ | ❌ |
| `notifications` | ❌ | ❌ | ❌ |
| `audit_logs` | ❌ | ❌ | ❌ |
| `blog_categories` | ❌ | ❌ | — |
| `project_categories` | جزئي (slug في create) | ❌ إدارة | — |
| `job_categories` | ❌ | ❌ | — |
| `refresh_tokens` | auth داخلي | — | — |

### 2.5 صفحات ناقصة (Public)

| Route | الحالة |
|-------|--------|
| `/blog/[slug]` | ❌ API موجود `GET /blog/posts/:slug` |
| `/projects/[slug]` | ❌ |
| `/careers/[slug]` + Apply مخصص | ⚠️ modal apply فقط |
| `/privacy` | ❌ |
| `/terms` | ❌ |
| `/403` | ❌ |

### 2.6 صفحات ناقصة (Admin)

| Route | الحالة |
|-------|--------|
| `/admin/settings` | ❌ |
| `/admin/media` | ❌ |
| `/admin/seo` | ❌ |
| `/admin/website-sections` | ❌ |
| `/admin/team` | ❌ |
| `/admin/partners` | ❌ |
| `/admin/testimonials` | ❌ |
| `/admin/audit` | ❌ |
| `/admin/notifications` | ❌ |
| `/admin/profile` | ❌ |
| Dashboards منفصلة لكل دور (8) | ❌ لوحة واحدة |

### 2.7 Customer / Employee portals
- **غير موجودة بالكامل**

---

## 3. الصفحات ↔ API Mapping

### Admin (HTTP mode)

| Page | listAdmin | Create | Update | Delete | ملاحظات |
|------|-----------|--------|--------|--------|---------|
| services | ✅ | ✅ | ✅ | ✅ | حقول كاملة تقريباً |
| projects | ✅ | ✅ | ✅ | ✅ | categorySlug فقط |
| blog | ✅ | ✅ | ✅ | ✅ | title/content/locale |
| jobs | ✅ | ✅ | ✅ | ✅ | |
| users | ✅ | ✅ | ✅ | ✅ soft delete |
| roles | — | ❌ | ❌ | ❌ | read-only cards |
| applications | ✅ | N/A | status/notes | ❌ | |
| contacts | ✅ | N/A | status | ❌ | |

### Public

| Page | Data source | Real DB |
|------|-------------|---------|
| home | services, projects, testimonials | ✅ if HTTP + published |
| services | GET /services | ✅ |
| projects | GET /projects | ✅ |
| blog | GET /blog/posts?locale | ✅ |
| careers | GET /jobs + POST apply | ✅ |
| contact | POST /contacts | ✅ |
| about | static/mock | ⚠️ |

---

## 4. Database — Prisma ↔ MySQL

### 4.1 التحقق
- **PK:** UUID `CHAR(36)` على كل model رئيسي ✅
- **FK:** معرّفة في Prisma → migration MySQL ✅
- **Indexes:** على email, slug, roleId, deletedAt, status ✅
- **Soft delete:** `deletedAt` على معظم content models ✅

### 4.2 ازدواجية `omq_db` vs `umq_platform`
- التطبيق يستخدم **`umq_platform` فقط**
- `omq_db` legacy: schema مختلف (INT IDs) — **لا يُستخدم runtime**
- ترحيل: `scripts/migrate-from-omq.ts` للإعدادات فقط

### 4.3 حقول غير مستخدمة في UI (توثيق)
- `User`: avatarMediaId, locale, createdById, audit fields
- `Project`: coverMediaId, completedAt
- `BlogPost`: categoryId, authorId, coverMediaId
- `Application`: resumeMediaId, source
- `MediaLibrary`: كامل — لا upload pipeline

---

## 5. مشاكل RBAC

1. **Middleware:** يفحص `umq_access` cookie فقط — لا permissions
2. **AdminPermissionGate:** client-side redirect — ليس 403 page
3. **API:** PermissionsGuard ✅ — المصدر الموثوق
4. **أزرار CRUD:** محسّنة جزئياً per-page — ليس نظاماً مركزياً
5. **أدوار المواصفات (8)** vs **seed (4)** — فجوة استراتيجية

---

## 6. مشاكل Authentication

1. Tokens في **localStorage** (`umq-auth` persist) — مخالف للمواصفات
2. `umq_access` cookie readable 15m — ليس HttpOnly
3. `failedLoginCount` يزيد؛ **`lockedUntil` never set**
4. No `POST /auth/forgot-password` implementation
5. No password reset token table migration
6. Refresh rotation ✅ في DB

---

## 7. مشاكل الأداء

1. Admin lists: no pagination — full table fetch
2. Public SSR: parallel `getAll` without cache/revalidate strategy
3. No image optimization pipeline (media URLs نصية)
4. Dashboard N+1 potential on stats (parallel calls OK for now)

---

## 8. مشاكل الأمن

| تهديد | الخطورة | الحالة |
|-------|---------|--------|
| XSS → token theft | عالية | localStorage |
| Brute force login | عالية | no rate limit |
| CSRF | متوسطة | Bearer from storage |
| Default JWT_SECRET | عالية | env fallback in dev |
| Helmet / CSP | — | not configured |
| Audit logging | — | schema only |
| Public spam (contact/apply) | متوسطة | no rate limit |

---

## 9. UI/UX gaps

- لا skeleton loaders موحّدة
- Empty states جزئية
- Error boundaries غير مكتملة
- لا يطابق مستوى Stripe/Linear بعد
- `dashboard-client.tsx` legacy mock banner قد يبقى
- Applications مكررة في jobs tab + صفحة منفصلة

---

## 10. Testing & CI

- **0** unit/integration/e2e tests
- `pnpm test` غير معرّف في root
- Coverage target 80%: **غير محقق**

---

## 11. خطة المراحل (16) — حالة التتبع

| Phase | الوصف | الحالة |
|-------|--------|--------|
| 1 | Audit → هذا الملف | ✅ |
| 2 | Database First — إزالة Mock | ✅ |
| 3 | DB mapping كامل | ✅ `docs/DB_MAPPING.md` |
| 4 | إصلاح جميع APIs | 🔄 التالي |
| 5 | تحسين UI/UX | ⏳ |
| 6 | صفحات ناقصة | ⏳ |
| 7 | Auth كامل + HttpOnly | ⏳ |
| 8 | RBAC 8 أدوار | ⏳ |
| 9 | Dynamic navigation | ⚠️ جزئي |
| 10 | Route protection 403 | ⏳ |
| 11 | Dashboards per role | ⏳ |
| 12 | CMS كامل | ⏳ |
| 13 | Security hardening | ⏳ |
| 14 | Performance | ⏳ |
| 15 | Testing 80% | ⏳ |
| 16 | Production docs | ⏳ |

---

## 12. أولويات التنفيذ (P0 → P2)

### P0 (قبل أي demo إنتاجي)
1. إزالة Mock بالكامل — HTTP + MySQL فقط
2. HttpOnly cookies + إزالة tokens من localStorage
3. Forgot/Reset/Change password
4. صفحات detail public (blog/project/job)
5. Admin: settings, media (أساسي), audit read

### P1
6. RBAC roles expansion + permission matrix doc
7. 403 page + middleware JWT verify
8. Rate limiting + Helmet
9. Pagination admin lists

### P2
10. Customer portal
11. E2E tests + CI
12. Production deployment docs

---

## 13. Build / Lint baseline (آخر فحص)

```bash
pnpm --filter @umq/shared build
pnpm --filter @umq/api check-types    # ✅
pnpm --filter @umq/web check-types   # ✅
pnpm --filter @umq/web build         # ✅ (root .env loaded via next.config.js)
```

---

**آخر تحديث للمرحلة:** Phase 2 (No Mock) + Phase 3 (DB_MAPPING) مكتملان — التالي Phase 4 (APIs ناقصة).
