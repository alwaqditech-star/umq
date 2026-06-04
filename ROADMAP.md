# ROADMAP — UMQ Platform → Production Ready

**مرجع التدقيق:** [`PROJECT_AUDIT.md`](./PROJECT_AUDIT.md)  
**قاعدة البيانات المحلية:** `omq_db.sql` → ترحيل إلى `umq_platform` (Prisma)  
**مبدأ التنفيذ:** تحليل → إكمال → اختبار → توثيق — **بدون حذف كود عشوائي أو تغيير DB بدون تحليل**

---

## نظرة عامة على المراحل

| Phase | الاسم | المدة التقديرية | مخرجات رئيسية |
|-------|-------|-----------------|---------------|
| 1 | Audit | ✅ منجز | `PROJECT_AUDIT.md`, قرار DB |
| 2 | Database Integration | 1–2 أسبوع | ترحيل `omq_db`, DAL كامل |
| 3 | Authentication | 1 أسبوع | Login كامل + cookies + reset |
| 4 | Authorization | 1 أسبوع | RBAC أدوار جديدة + guards |
| 5 | Dashboards | 1 أسبوع | لوحة لكل دور |
| 6 | Features Completion | 2–3 أسابيع | APIs + admin pages ناقصة |
| 7 | UI Enhancement | 1–2 أسبوع | Responsive, motion, تنظيف |
| 8 | Security Hardening | 1 أسبوع | XSS/CSRF/rate limit/helmet |
| 9 | Testing | 1–2 أسبوع | unit + integration + CI test |
| 10 | Production Ready | 1 أسبوع | deploy, monitoring, docs |

---

## Phase 1 — Audit ✅

### الأهداف
- [x] تحليل هيكل المشروع
- [x] تحليل `omq_db.sql` vs Prisma
- [x] ERD داخلي (legacy + target)
- [x] جرد APIs / صفحات / RBAC / ثغرات
- [x] `PROJECT_AUDIT.md`

### قرارات مطلوبة من أصحاب المشروع
1. **هل نرحّل بيانات `omq_db`؟** (حالياً 4 إعدادات فقط — باقي الجداول فارغة)
2. **هل نبقي أسماء الأدوار الحالية** (`super-admin`, `editor`, `hr`, `viewer`) **أم** ننتقل إلى (`admin`, `manager`, `employee`, `customer`, `guest`)?
3. **منفذ MySQL:** Docker `:3307` vs محلي `:3306`

### مخرجات
- `PROJECT_AUDIT.md`
- `ROADMAP.md` (هذا الملف)

---

## Phase 2 — Database Integration

### الأهداف
- استيراد وتحليل `omq_db` على MariaDB/MySQL
- إكمال **طبقة Data Access** في `packages/database`
- سكربت ترحيل legacy → Prisma مع خريطة IDs
- مزامنة Prisma migrations مع بيئة الإنتاج

### مهام تقنية

| # | المهمة | الملفات / المنطقة |
|---|--------|-------------------|
| 2.1 | إنشاء `base.repository.ts` + إصلاح `RoleRepository` | `packages/database/src/repositories/` |
| 2.2 | Repositories: User, Permission, Service, Project, Blog, Job, Application, Contact, Setting, Media, Audit | نفس المجلد |
| 2.3 | تصدير factories من `@umq/database` | `src/index.ts` |
| 2.4 | Refactor NestJS services لاستخدام repositories | `apps/api/src/**/*.service.ts` |
| 2.5 | `scripts/migrate-legacy-db.ts` + `scripts/lib/legacy-db/*` | mapping من §4.3 في AUDIT |
| 2.6 | توثيق mapping | `docs/database/MAPPING.md` |
| 2.7 | إصلاح scripts الجذر: `migrate:legacy`, إزالة أو تنفيذ `db:migrate:omq` | `package.json` |
| 2.8 | `prisma migrate deploy` على staging/production | CI/CD |

### معايير القبول
- [ ] `pnpm migrate:legacy` ينقل `general_settings` + أي بيانات مستقبلية بدون فقد
- [ ] كل API module يمر عبر repository (لا Prisma مباشرة في controllers)
- [ ] `prisma migrate status` = up to date
- [ ] تقرير جداول legacy غير المستخدمة موثّق

### مخاطر
- **لا تغيير schema** لمجرد مطابقة legacy — الترحيل يتحوّل البيانات إلى schema الهدف
- INT → UUID يتطلب `id-map` ثابت أثناء الترحيل

---

## Phase 3 — Authentication

### الأهداف
Login احترافي: Login, Logout, Remember Me, Forgot, Reset, Change Password  
JWT + Refresh + **HttpOnly Cookies**

### مهام

| # | المهمة |
|---|--------|
| 3.1 | `POST /auth/forgot-password`, `POST /auth/reset-password` + جدول `password_reset_tokens` (migration جديدة بعد تحليل) |
| 3.2 | `POST /auth/change-password` (authenticated) |
| 3.3 | Remember Me: TTL أطول لـ refresh عند flag |
| 3.4 | Set-Cookie: `refresh` HttpOnly Secure SameSite; access اختياري HttpOnly أو قصير |
| 3.5 | تحديث `apps/web` auth-store + `httpAuthService` + إزالة tokens من localStorage |
| 3.6 | تفعيل `lockedUntil` بعد N محاولات فاشلة |
| 3.7 | Rate limit على login / forgot |
| 3.8 | SMTP module (env-based) لإرسال reset links |
| 3.9 | صفحات: `reset-password`, رابط forgot من login, i18n keys |

### معايير القبول
- [ ] لا refresh token في localStorage
- [ ] E2E: login → me → logout → me fails
- [ ] Forgot → email (أو log dev) → reset → login بكلمة جديدة

---

## Phase 4 — Authorization

### الأهداف
جلب User + Role + Permissions من DB على كل طلب محمي  
RBAC: Admin, Manager, Employee, Customer, Guest

### مهام

| # | المهمة |
|---|--------|
| 4.1 | تعريف أدوار جديدة في seed + ترحيل من legacy roles |
| 4.2 | Permission matrix كاملة لكل module (CRUD + assign) |
| 4.3 | `roles:manage` — CRUD roles + assign permissions API |
| 4.4 | إعادة التحقق من permissions من DB في `PermissionsGuard` (اختياري: cache قصير) أو إبطال JWT عند تغيير الدور |
| 4.5 | NestJS `@RequirePermissions` على كل admin routes |
| 4.6 | Next.js: middleware يتحقق من JWT (أو session API) — ليس cookie فقط |
| 4.7 | `AdminRouteGuard` + صفحة **403** |
| 4.8 | Dynamic Sidebar + إخفاء أزرار Actions حسب permission |

### معايير القبول
- [ ] مستخدم `viewer` يحصل 403 على `/admin/users` عند الوصول المباشر
- [ ] تغيير permissions في DB ينعكس خلال ≤ refresh TTL

---

## Phase 5 — Dashboards

### الأهداف
Dashboard منفصلة لكل دور مع widgets من API

| الدور | المحتوى |
|-------|---------|
| Admin | إحصائيات، users، roles، permissions، system logs |
| Manager | فريق، تقارير، modules معينة |
| Employee | مهام، بيانات شخصية |
| Customer | طلبات، ملف شخصي (portal منفصل `/[locale]/customer`) |
| Guest | public فقط |

### مهام
- 5.1 `GET /admin/dashboard/stats` (أو per-role endpoints)
- 5.2 `admin/page.tsx` → router حسب `roleSlug`
- 5.3 Customer layout + routes (`orders`, `requests`, `profile`) — يتطلب نماذج DB إن لم توجد (تحليل قبل migration)
- 5.4 Manager/Employee layouts under `/admin` or `/portal`

---

## Phase 6 — Features Completion

### APIs ناقصة (أولوية)

1. Admin CRUD: projects, blog, jobs  
2. Contacts admin (list, assign, status)  
3. Settings (من `general_settings` + `settings` JSON)  
4. Media upload (S3-compatible أو local disk)  
5. Audit log middleware + `GET /admin/audit-logs`  
6. Notifications  
7. CMS: website_sections, seo_pages, team, partners, testimonials  
8. Job apply: رفع resume → `media_library`  
9. Customer APIs (إن وُجدت متطلبات أعمال)

### صفحات Web ناقصة

- `/admin/settings`, `/admin/contacts`, `/admin/media`, `/admin/audit`
- `/admin/seo`, `/admin/sections` (أو ضمن settings)
- Customer portal routes
- Privacy, Terms

### معايير القبول
- [ ] كل عنصر في Sidebar له API + صفحة تعمل في `NEXT_PUBLIC_API_MODE=http`
- [ ] لا 404 من `httpCrud` على المسارات المعلنة في UI

---

## Phase 7 — UI Enhancement

- مراجعة responsive (mobile-first) لكل public + admin pages
- توحيد Framer Motion (page transitions, lists)
- إزالة: applications المكرر في jobs، `axios`, `next-themes` إن لم تُستخدم
- توحيد نماذج CRUD (forms + validation zod)
- تحسين accessibility (focus, aria, contrast)
- ربط careers apply + contact feedback UX

---

## Phase 8 — Security Hardening

| بند | إجراء |
|-----|--------|
| XSS | HttpOnly cookies, CSP headers, sanitize rich text |
| CSRF | SameSite cookies + CSRF token للـ cookie-based mutations |
| SQLi | الإبقاء على Prisma؛ مراجعة raw queries إن وُجدت |
| Auth bypass | JWT validation في middleware |
| Privilege escalation | Server-side permission على كل route |
| Brute force | rate-limiter (nestjs-throttler) |
| Headers | Helmet |
| Secrets | إلزام `JWT_SECRET` في production |
| Uploads | MIME sniff, size cap, virus scan (optional) |

---

## Phase 9 — Testing

### هيكل مقترح

```
apps/api/test/          # Jest e2e + unit
apps/web/__tests__/     # Vitest/RTL
packages/database/      # repository integration (test DB)
```

### مهام
- 9.1 `pnpm test` في الجذر → turbo
- 9.2 Unit: auth service, permissions guard, repositories
- 9.3 Integration: login flow, CRUD services, public endpoints
- 9.4 Web: login, admin guard, sidebar filter
- 9.5 CI job: `pnpm test` بعد migrate + seed

### معايير القبول
- [ ] Lint Success
- [ ] Build Success  
- [ ] Tests Success (coverage هدف ≥ 60% للـ critical paths)

---

## Phase 10 — Production Ready

### DevOps
- [ ] `.env.production.example`
- [ ] Docker compose prod (api + web + mysql أو managed DB)
- [ ] Health checks + graceful shutdown
- [ ] Structured logging (pino) + request ID
- [ ] Backup strategy لـ MySQL
- [ ] GitHub Actions: deploy workflow (staging → prod)

### توثيق
- [ ] `docs/DEPLOYMENT.md`
- [ ] Runbook: migrate, seed, rollback
- [ ] Admin onboarding (أدوار، كلمات مرور)

### Checklist نهائي
- [ ] `pnpm lint && pnpm check-types && pnpm build && pnpm test`
- [ ] Security review مكتمل
- [ ] Performance: Lighthouse على public pages
- [ ] RBAC matrix موقّع من العميل

---

## ترتيب التنفيذ الموصى به (Dependencies)

```mermaid
flowchart LR
  P1[Phase 1 Audit] --> P2[Phase 2 DB]
  P2 --> P3[Phase 3 Auth]
  P3 --> P4[Phase 4 AuthZ]
  P4 --> P5[Phase 5 Dashboards]
  P4 --> P6[Phase 6 Features]
  P6 --> P7[Phase 7 UI]
  P3 --> P8[Phase 8 Security]
  P6 --> P9[Phase 9 Testing]
  P7 --> P9
  P8 --> P9
  P9 --> P10[Phase 10 Production]
```

---

## ربط `omq_db.sql` — خطوات عملية (Phase 2)

```bash
# 1) استيراد legacy (MariaDB/phpMyAdmin أو CLI)
mysql -u root -p < "C:\Users\ENG-OSAMA\Downloads\omq_db.sql"

# 2) تشغيل منصة UMQ على umq_platform
docker compose up -d mysql
pnpm db:migrate:deploy
pnpm db:seed

# 3) بعد إكمال سكربت الترحيل
pnpm migrate:legacy
```

**متغيرات بيئة مقترحة للترحيل:**
```env
LEGACY_DATABASE_URL="mysql://root:@localhost:3306/omq_db"
DATABASE_URL="mysql://umq:umq_dev_password@localhost:3307/umq_platform"
```

---

## قواعد العمل (من المواصفات)

| ممنوع | مسموح |
|--------|--------|
| حذف كود بدون سبب | Refactor تدريجي مع tests |
| كسر وظائف موجودة | Feature flags / parallel paths |
| تغيير DB بدون تحليل | Migrations مراجعة + rollback plan |
| افتراض علاقات غير موجودة | توثيق في MAPPING.md |

---

## الحالة الحالية

| Phase | Status |
|-------|--------|
| 1 Audit | **Complete** |
| 2–10 | **Not started** (في انتظار الموافقة على قرارات §Phase 1) |

**الإجراء التالي:** مراجعة `PROJECT_AUDIT.md` → تأكيد استراتيجية DB والأدوار → البدء **Phase 2** فقط بعد الموافقة.
