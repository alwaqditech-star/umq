# UMQ PLATFORM — COMPLETE SYSTEM AUDIT

**تاريخ التدقيق:** 2026-06-05  
**النطاق:** تحليل فقط — **لم يُعدَّل أي كود تطبيقي** خلال هذا التدقيق  
**المراجع:** الكود الحالي في `apps/api`, `apps/web`, `packages/database`, `packages/shared`, `docs/*`  
**المنهجية:** فحص يدوي للبنية، Prisma، Controllers/Services، الواجهات، الأمان، الأداء، SEO، الاختبارات، والتوثيق

---

## Executive Summary (ملخص تنفيذي)

| # | السؤال | الإجابة |
|---|--------|---------|
| 1 | **نسبة اكتمال المشروع الحالية** | **~70%** من مواصفات منصة مؤسسية كاملة (موقع + CMS + RBAC + API) |
| 2 | **نسبة جاهزية الإنتاج** | **~56%** |
| 3 | **المهام الحرجة المتبقية** | **14** |
| 4 | **المهام المتوسطة المتبقية** | **22** |
| 5 | **المهام البسيطة المتبقية** | **18** |
| 6 | **هل المشروع جاهز للنشر؟** | **لا** |
| 7 | **ما الذي يمنع النشر حاليًا؟** | غياب اختبارات آلية، تحقق DTOs غير مكتمل على معظم الـ Admin APIs، بريد إعادة تعيين كلمة المرور غير مفعّل في الإنتاج، SEO عام (sitemap/robots/canonical)، صفحات إدارة CMS ناقصة (فريق/شركاء/SEO)، مخاطر أمنية في مسار الملفات والصلاحيات المخزّنة في JWT، وعدم وجود مراقبة/نسخ احتياطي موثّق |
| 8 | **Sprints متبقية للوصول إلى Prod** | **4–6 sprints** (أسبوعان لكل sprint) ≈ **8–12 أسبوعًا** مع فريق صغير |

---

## 1. Architecture Audit

### Current Status
Monorepo **pnpm + Turborepo** مع فصل واضح: `apps/api` (NestJS 11), `apps/web` (Next.js 15 App Router), `packages/database` (Prisma), `packages/shared` (RBAC + password). CI على GitHub Actions يشغّل migrate + seed + lint + types + build.

### Strengths
- فصل Public / Auth / Admin / Editor عبر route groups
- Global guards (JWT + Permissions + Throttle) و Audit interceptor
- Proxy موحّد `/api/v1` من Next إلى Nest
- توثيق تشغيلي: `README.md`, `DEPLOYMENT_GUIDE.md`, `CURRENT_STATUS.md`

### Weaknesses
- طبقة Domain/Repositories غير مكتملة — Prisma مباشرة في Services
- `packages/ui` شبه غير مستخدم — مكوّنات مكررة في `apps/web/components`
- كثير من Admin endpoints تقبل `Record<string, unknown>` بدون DTOs
- تعدد تقارير تدقيق قديمة (`FINAL_AUDIT.md`, `PROJECT_AUDIT.md`) تتعارض مع الواقع الحالي

### Risks
- Technical debt يتراكم مع كل ميزة جديدة بدون عقود API ثابتة
- صعوبة استبدال Prisma أو إضافة خدمات مصغّرة لاحقًا

### Priority
**Medium** — إعادة هيكلة تدريجية وليست حاجز إطلاق فوري

### Recommendations
1. تعريف DTOs + OpenAPI/Swagger لكل module
2. استخراج `ContentService` مشترك للكيانات ذات `ContentStatus`
3. توحيد التوثيق في ملف حالة واحد (`CURRENT_STATUS.md`) وإهمال التقارير القديمة

### Scores & Completion
| Metric | Score (0–100) |
|--------|---------------|
| Folder Structure | 85 |
| Layer Separation | 68 |
| Scalability | 72 |
| Maintainability | 75 |
| Monorepo / Deps | 82 |
| **Architecture Overall** | **78** |
| **Completion %** | **78%** |

---

## 2. Database Audit (Prisma / MySQL)

### Current Status
**20 نموذجًا** في `schema.prisma`: Users, Roles, Permissions, Refresh/PasswordReset tokens, Services, Projects, Blog, Team, Partners, Testimonials, Contacts, Media, WebsiteSection, HomeSection, SeoPage, Setting, Notification, AuditLog.

### Strengths
- UUIDs، soft delete (`deletedAt`) على معظم الكيانات
- فهارس على `status`, `slug`, `locale`, `roleId`, audit timestamps
- علاقات FK صحيحة مع `onDelete: Cascade` حيث يلزم
- Migrations منظمة + seed شامل للأدوار والصلاحيات والمحتوى التجريبي

### Weaknesses
- جدول `notifications` **بدون API أو UI**
- لا pagination على مستوى DB (cursor/offset tables)
- لا full-text indexes للبحث
- `BlogPost` أحادي اللغة لكل صف (`locale` per row) — مقبول لكن يزيد التعقيد
- بعض الحقول `createdById`/`updatedById` غير مربوطة بـ FK في Schema

### Risks
- نمو `audit_logs` و `refresh_tokens` بدون سياسة أرشفة
- استعلامات `findMany` بدون `take` في عدة services

### Priority
**Medium**

### Recommendations
1. Job أرشفة/تنظيف للـ tokens والـ audit
2. Indexes مركبة للبحث العام إن لزم
3. مراجعة FKs للـ audit fields

### Scores & Completion
| Metric | Score |
|--------|-------|
| Relations & FKs | 88 |
| Indexes | 80 |
| Normalization | 82 |
| Prisma Mapping | 90 |
| Performance posture | 72 |
| **Database Overall** | **83** |
| **Completion %** | **83%** |

---

## 3. API Audit

### Current Status
Prefix: `/api/v1`. Controllers: Auth, Users, Roles, Services, Projects, Blog, Contacts, Categories, CMS (testimonials/team/partners/settings/sections/seo/audit/dashboard), Media, Search, Health.

### Strengths
- فصل Public vs Admin controllers
- ValidationPipe عالمي (`whitelist`, `forbidNonWhitelisted`)
- Blog: related posts, locale filter
- Search عام public
- Health endpoint للنشر

### Weaknesses
| Area | Gap |
|------|-----|
| DTOs | فقط Auth, Users, Categories — الباقي `Record<string, unknown>` |
| Pagination | غير موحّد؛ audit يستخدم `limit` فقط |
| Filtering | محدود على القوائم العامة |
| Roles API | قراءة فقط — لا تحديث صلاحيات دور |
| Notifications | غير مُعرَّض |
| Email | forgot-password يعيد `resetUrl` في dev فقط |

### Missing / Broken Endpoints
- **غير موجود:** إدارة أدوار كتابة (PATCH roles permissions)
- **غير موجود:** Notifications, Newsletter, Analytics
- **جزئي:** Settings/SEO — API موجود، **لوحة إدارة Web ناقصة**
- **تعارض محتمل:** ترتيب routes في blog (`:slug/related` قبل `:slug` — صحيح حاليًا)

### Risks
- إدخال غير متوقع يصل لـ Prisma من body غير مُحقَّق
- IDOR محتمل إذا أُضيفت endpoints بدون guards لاحقًا

### Priority
**High** (DTOs + pagination)

### Recommendations
1. DTO + class-validator لكل POST/PATCH admin
2. معيار `?page=&limit=` موحّد
3. Swagger/OpenAPI
4. Versioning strategy (`/api/v2`) لاحقًا

### Scores & Completion
| **API Overall** | **71** |
| **Completion %** | **71%** |

---

## 4. Authentication Audit

### Current Status
| Feature | Status |
|---------|--------|
| JWT Access | ✅ 15m default |
| Refresh tokens | ✅ hashed in DB, rotation on refresh |
| HttpOnly cookies | ✅ `umq_access`, `umq_refresh`, SameSite=Strict |
| Session list/revoke | ✅ |
| Password reset | ✅ API + UI (token in dev response) |
| Account lockout | ✅ `failedLoginCount`, `lockedUntil` |
| Password policy | ✅ 8+ mixed case + number (shared package) |
| Remember me | ✅ extended refresh |
| Logout | ✅ revokes refresh + clears cookies |

### Weaknesses
- **لا إرسال بريد** لـ forgot-password في production
- Permissions مضمّنة في JWT — **قديمة حتى refresh**
- Middleware يتحقق من وجود cookie فقط لا صلاحية الدور
- `JWT_SECRET` default في `.env.example` ضعيف للإنتاج

### Risks
- سرقة session عبر XSS على محتوى غني (blog HTML) رغم HttpOnly للـ tokens
- Brute force mitigated جزئيًا بـ throttle — ليس per-IP granular

### Priority
**Critical** (email + production secrets)

### Scores & Completion
| **Authentication Overall** | **84** |
| **Completion %** | **84%** |

---

## 5. RBAC Audit

### Current Status
**3 أدوار seed:** `super-admin`, `admin`, `editor`. **15 permission slug**. Guards: `JwtAuthGuard` + `PermissionsGuard` + `@RequirePermissions()`. Super-admin يحصل `["*"]` في JWT.

### Strengths
- فصل `/admin` vs `/editor` في shared RBAC
- `AdminAuthGate`, `AdminPermissionGate`, `EditorPermissionGate`
- Sidebar يُفلتر بـ `filterNavByPermissions`
- Dashboard stats تُقيَّد حسب permissions في API

### Weaknesses
- **لا واجهة** لتعديل صلاحيات الأدوار (roles read-only API)
- `contacts` في admin nav يتطلب `users:read` — **خطأ منطقي**
- UI permissions قد تتقدم على API أو العكس عند تغيير الدور دون re-login
- لا اختبارات لـ privilege escalation

### Privilege Escalation Risks
| Risk | Severity |
|------|----------|
| Admin يحدّث `roleId` لأي مستخدم إلى super-admin عبر Users API | **High** إن لم يُقيَّد في service |
| JWT permissions stale | **Medium** |
| Editor يصل `/admin` عبر URL | **Low** — Auth gate يوجّه |

### Priority
**High**

### Scores & Completion
| **RBAC Overall** | **74** |
| **Completion %** | **74%** |

---

## 6. Security Audit (OWASP-oriented)

### Current Status
| Control | Status |
|---------|--------|
| Helmet | ✅ (CSP معطّل في non-production) |
| Rate limiting | ✅ Throttler global + auth endpoints |
| CORS | ✅ configurable |
| Audit logs | ✅ mutating requests (بدون auth paths) |
| Password hashing | ✅ scrypt via shared |
| HttpOnly cookies | ✅ |
| SQL Injection | ✅ Prisma parameterized |
| XSS | ⚠️ محتوى blog/sections HTML بدون sanitization ظاهرة |
| CSRF | ⚠️ SameSite=Strict يخفّف؛ لا token صريح |
| IDOR | ⚠️ Users update أي roleId — يحتاج policy |
| Path traversal (media) | ⚠️ `folder` في upload + `resolveFileStream` بدون jail على `uploadDir` |
| Public media files | ✅ مقصود — لكن أي ملف مرفوع قابل للوصول بالـ URL |
| Sensitive data | ⚠️ reset URL في dev؛ audit يخفّي passwords |
| Security headers (web) | ⚠️ يعتمد على Nest/Helmet للـ API فقط |

### OWASP Top 10 Snapshot
| Risk | Assessment |
|------|------------|
| A01 Broken Access Control | Medium |
| A02 Cryptographic Failures | Low–Medium (env defaults) |
| A03 Injection | Low |
| A04 Insecure Design | Medium |
| A05 Security Misconfiguration | Medium |
| A07 Identification Failures | Low–Medium |
| A08 Software/Data Integrity | Low |

### Priority
**Critical** — media path + role assignment policy + XSS على المحتوى

### Scores & Completion
| **Security Overall** | **70** |
| **Completion %** | **70%** |

---

## 7. Frontend Audit

### Current Status
Next.js 15، i18n `ar`/`en`، RTL، Framer Motion، design tokens في `globals.css`، dark mode عبر `data-theme`.

### Strengths
- مكوّنات UI قابلة لإعادة الاستخدام (Button, Card, Table, Modal, …)
- تحسينات أداء: `revalidate = 60`, `unstable_cache`, Suspense على Home
- تنقل سريع: `FastNavLink`, `NavigationProgress`
- صفحات خطأ 403/404 premium
- Blog/Projects detail مع صور `next/image`

### Weaknesses
- **لا صفحة تفاصيل خدمة** (`/services/[slug]`)
- About **ثابت** — غير مربوط بـ Website Sections
- Accessibility: جزئي (بعض `aria-label`، لا تدقيق WCAG شامل)
- `persist` لـ user في zustand — permissions قديمة محليًا
- `<img>` في admin media بدل `Image`
- تناقضات dark mode تم إصلاح جزء منها مؤخرًا — يحتاج مراجعة بصرية شاملة

### Scores & Completion
| UI Consistency | 80 |
| Responsiveness | 82 |
| RTL / Arabic | 88 |
| Component Reuse | 78 |
| Error/Empty/Loading | 75 |
| **Frontend Overall** | **79** |
| **UI/UX Score** | **78** |
| **Completion %** | **79%** |

---

## 8. CMS Audit (Module Matrix)

| Module | API | Admin UI | Public UI | Status |
|--------|-----|----------|-----------|--------|
| Blog | ✅ | ✅ | ✅ | **مكتمل** (~85%) |
| Projects | ✅ | ✅ | ✅ list + detail | **مكتمل** (~80%) |
| Services | ✅ | ✅ | ⚠️ list فقط | **جزئي** (~65%) |
| Media | ✅ | ✅ | ✅ via URLs | **مكتمل** (~80%) |
| SEO (`seo_pages`) | ✅ | ❌ | ⚠️ blog فقط | **جزئي** (~40%) |
| Settings | ✅ | ❌ | ⚠️ عبر site-config | **جزئي** (~50%) |
| Website Sections | ✅ | ✅ | ✅ hero/home | **جزئي** (~70%) |
| Home Sections toggles | ✅ | ✅ | ✅ | **مكتمل** (~85%) |
| Testimonials | ✅ | ✅ | ✅ home | **مكتمل** (~80%) |
| Partners | ✅ | ❌ | ✅ home | **جزئي** (~55%) |
| Team Members | ✅ | ❌ | ✅ home | **جزئي** (~55%) |
| Categories | ✅ | ✅ | ⚠️ blog/projects | **جزئي** (~70%) |
| Contacts | ✅ | ✅ | ✅ form | **مكتمل** (~85%) |
| Users/Roles | ✅ | ✅ read / ❌ role edit | **جزئي** (~60%) |
| Audit Logs | ✅ | ✅ | — | **مكتمل** (~75%) |

### CMS Aggregate
| **CMS Score** | **65** |
| **Completion %** | **~65%** |

---

## 9. Blog Audit

| Feature | Status | % |
|---------|--------|---|
| Blog List | ✅ | 100 |
| Blog Detail | ✅ | 100 |
| SEO (metadata + JSON-LD) | ✅ detail | 90 |
| Related Posts | ✅ API + UI | 100 |
| Categories | ✅ DB + admin categories | 70 |
| Tags | ✅ JSON field + badges | 80 |
| Sharing | ✅ Web Share API / clipboard | 75 |
| Cover image | ✅ (حديثًا) | 85 |
| i18n per post | ✅ locale column | 100 |
| RSS | ❌ | 0 |

**Blog Completion: ~82%**

---

## 10. Website Audit (Public)

| Page | Status | % |
|------|--------|---|
| Home | ✅ dynamic sections | 90 |
| About | ⚠️ static copy | 60 |
| Services | ⚠️ list only | 65 |
| Projects | ✅ list + detail | 85 |
| Blog | ✅ list + detail | 85 |
| Contact | ✅ | 85 |
| 404 | ✅ `not-found.tsx` | 80 |
| 403 | ✅ `/forbidden` | 85 |
| Header/Nav | ✅ | 85 |
| Footer | ✅ | 85 |
| Careers/Jobs | ❌ removed | N/A |

**Website Completion: ~78%**

---

## 11. Dashboard Audit

| Role | Panel | Stats | Content Mgmt | % |
|------|-------|-------|--------------|---|
| SUPER_ADMIN | `/admin` | ✅ | ✅ full nav | 85 |
| ADMIN | `/admin` | ✅ filtered | ✅ most | 80 |
| EDITOR | `/editor` | ⚠️ limited | blog/projects/media | 70 |

| Feature | Status |
|---------|--------|
| Widgets / charts | ❌ أرقام فقط |
| Partners/Team admin | ❌ |
| SEO admin | ❌ |
| Settings admin | ❌ |
| Notifications | ❌ |

**Dashboard Completion: ~75%**

---

## 12. Performance Audit

### Current Status
- Next: `revalidate = 60`, experimental `staleTimes`, `optimizePackageImports`
- Server: `unstable_cache` في site-config
- API: لا caching layer (Redis)
- Images: `next/image` على العام؛ admin media يستخدم `<img>`

### Weaknesses
- لا قياس Core Web Vitals في CI
- `framer-motion` حجم bundle
- قوائم admin تُحمّل كامل الجدول دفعة واحدة
- Build أبلغ عن خطأ `PageNotFoundError` لـ `/about` في بيئة معينة — يحتاج تحقق

### Scores & Completion
| **Performance Overall** | **73** |
| **Completion %** | **73%** |

---

## 13. Testing Audit

| Type | Files | Coverage |
|------|-------|----------|
| Unit | 1 (`categories.service.spec.ts`) | ~1% |
| Integration | 0 | 0% |
| E2E | 0 | 0% |
| CI tests | ❌ غير مُشغّلة | 0% |

### Priority
**Critical**

| **Testing Overall** | **3** |
| **Estimated Coverage** | **~1–2%** |

---

## 14. SEO Audit

| Item | Status |
|------|--------|
| Meta tags (global) | ✅ root layout |
| Per-page metadata | ⚠️ blog قوي؛ باقي الصفحات ضعيف |
| Open Graph | ✅ blog detail |
| Twitter Cards | ✅ blog detail |
| JSON-LD | ✅ blog detail |
| Sitemap.xml | ❌ |
| robots.txt | ❌ |
| Canonical URLs | ❌ |
| hreflang ar/en | ⚠️ جزئي عبر routing فقط |

| **SEO Overall** | **52** |
| **Completion %** | **52%** |

---

## 15. Code Quality & Documentation

### Code Quality
- TypeScript strict عبر turbo `check-types`
- ESLint + Prettier في CI
- تكرار في mappings (blog/service)
- **`dist/` وملفات build قد تُلوّث git** — يُفضّل `.gitignore` صارم

| **Code Quality Score** | **72** |

### Documentation
| Doc | Quality |
|-----|---------|
| README | ✅ Good |
| DEPLOYMENT_GUIDE | ✅ Adequate |
| API_DOCUMENTATION | ⚠️ قديم جزئيًا |
| AUTH_SECURITY | ⚠️ يذكر localStorage — **غير محدّث** |
| Role matrix docs | ✅ موجودة |

| **Documentation Score** | **68** |

---

## 16. Deployment & DevOps

### Current Status
- `docker-compose.yml` لـ MySQL
- CI: lint, types, build, migrate, seed
- لا Dockerfile للتطبيقات
- لا Kubernetes/Terraform
- لا مراقبة (Sentry/Datadog) في الكود

### Priority
**High** للإنتاج

| **Deployment Readiness** | **55%** |

---

## 17. Accessibility Audit (Brief)

- RTL وخط عربي IBM Plex: ✅
- Focus visible في globals: ✅
- Skip links: ❌
- Keyboard traps في modals: ⚠️ غير مُختبر
- Contrast dark mode: ⚠️ تحسينات جارية

| **Accessibility Score** | **62** |

---

## FINAL SCORES TABLE

| Dimension | Score (0–100) |
|-----------|---------------|
| Architecture | 78 |
| Database | 83 |
| API | 71 |
| Authentication | 84 |
| RBAC | 74 |
| Security | 70 |
| Frontend | 79 |
| UI/UX | 78 |
| CMS | 65 |
| Performance | 73 |
| SEO | 52 |
| Code Quality | 72 |
| Testing | 3 |
| Accessibility | 62 |
| Documentation | 68 |
| **Production Readiness** | **56** |

### Weighted Project Completion
(موقع 25% + CMS 25% + API/Backend 20% + Auth/RBAC/Security 20% + Quality/Tests 10%)

**≈ 70% اكتمال وظيفي**

---

## FINAL ROADMAP

### Critical (Must before Prod)
1. **Test suite**: unit + integration (auth, RBAC, blog, users) + E2E smoke (login, CRUD, public pages)
2. **Production env hardening**: `JWT_SECRET`, `AUTH_COOKIE_SECURE=true`, CORS, CSP في production
3. **Email provider** لـ password reset (إزالة `resetUrl` من الاستجابة)
4. **DTO validation** لجميع Admin POST/PATCH bodies
5. **Media upload path jail** + منع `..` في `folder` + التحقق من المسار داخل `UPLOAD_DIR`
6. **RBAC policy**: منع ترقية الأدوار غير المصرّح بها في `UsersService.update`
7. **JWT permissions refresh** عند تغيير الدور أو تقصير access token reliance
8. **XSS sanitization** لمحتوى blog/CMS الغني
9. **SEO baseline**: `sitemap.xml`, `robots.txt`, canonical + metadata لكل الصفحات العامة
10. **Admin UI**: Partners, Team, SEO pages
11. **CI**: إضافة `pnpm test` وفشل البناء عند انخفاض التغطية
12. **Monitoring + backups**: DB backups, health alerts, structured logging
13. **إصلاح صلاحية contacts** في admin nav (`contacts:read` أو `cms:manage`)
14. **تحقق build مستقر** لجميع routes (بما فيها `/about`)

### High
1. صفحة `/services/[slug]`
2. ربط About بـ Website Sections CMS
3. Pagination/filtering موحّد في API + جداول Admin
4. Roles management API (تعيين permissions)
5. Project cover في admin form (مثل blog)
6. Redis أو cache للقوائم العامة عالية الزيارات
7. تحديث `AUTH_SECURITY.md` و `API_DOCUMENTATION.md`
8. CSRF token للطلبات الحساسة (defense in depth)
9. Rate limit per-IP على login
10. Docker images للـ api + web
11. Staging environment playbook
12. Core Web Vitals قياس قبل الإطلاق
13. إزالة careers/jobs من dictionaries إن بقيت
14. Soft-delete consistency في كل public queries
15. OpenAPI spec من DTOs
16. Audit log retention policy
17. Session admin: عرض وتسجيل خروج الأجهزة في UI
18. Settings admin UI
19. Category filters على blog public
20. RSS feed للمدونة
21. 2FA (اختياري للمؤسسات) — تخطيط
22. Penetration test خارجي

### Medium
1. تحسين `packages/ui` أو حذف الحزمة
2. Notifications module أو حذف الجدول
3. Rich text editor موحّد في admin
4. Bulk actions في الجداول
5. Export audit logs CSV
6. Image CDN / object storage (S3) بدل disk
7. hreflang links في metadata
8. Analytics integration
9. Webhook integrations
10. Content versioning
11. Scheduled publish للمدونة
12. Multi-tenant readiness review
13. API versioning policy doc
14. Improve error messages i18n في API
15. Admin keyboard shortcuts
16. Compress/upload WebP pipeline
17. Database read replica doc
18. Feature flags للأقسام

### Low
1. Animations تخفيف على prefers-reduced-motion
2. PWA manifest
3. Print styles
4. Blog reading progress bar
5. Social meta auto from cover dimensions
6. Changelog في admin
7. Dark mode auto من system فقط
8. Seed بيانات demo إضافية
9. Storybook للمكوّنات
10. Commit hooks إلزامية
11. License file
12. CONTRIBUTING.md
13. Performance budget في CI
14. Arabic numeral locale toggle
15. Custom 500 page server-wide
16. GraphQL gateway evaluation
17. Brand PDF style guide link
18. Footer legal pages (privacy/terms)

---

## Risk Register (Top 10)

| # | Risk | Impact | Likelihood |
|---|------|--------|------------|
| 1 | لا اختبارات → regressions في الإنتاج | High | High |
| 2 | Admin body غير مُحقَّق → بيانات تالفة/ثغرة | High | Medium |
| 3 | Media path traversal | High | Low–Medium |
| 4 | XSS في محتوى المنشورات | High | Medium |
| 5 | JWT permissions stale | Medium | Medium |
| 6 | لا email reset في prod | High | High |
| 7 | SEO ضعيف → ضعف اكتشاف | Medium | High |
| 8 | Role escalation عبر users API | High | Medium |
| 9 | غياب monitoring | High | High |
| 10 | توثيق أمني قديم يضلّل الفريق | Medium | High |

---

## Appendix A — API Endpoint Inventory (Summary)

| Module | Public | Protected |
|--------|--------|-----------|
| auth | login, refresh, forgot/reset password | me, logout, change-password, sessions |
| users | — | CRUD |
| roles | — | list, permissions list, get |
| services | list, by slug | admin CRUD |
| projects | list, by slug | admin CRUD |
| blog | posts, slug, related | admin CRUD |
| contacts | POST | admin list/update status |
| categories | — | admin CRUD |
| cms | team, partners, sections, settings (public reads) | admin CRUD + audit + dashboard stats |
| media | files serve | admin upload/list/delete |
| search | GET q | — |
| health | GET | — |

---

## Appendix B — Tech Stack Verified

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind v4, Zustand, Framer Motion |
| Backend | NestJS 11, Prisma, MySQL 8 |
| Auth | JWT + HttpOnly cookies + refresh rotation |
| Monorepo | pnpm 9, Turborepo 2 |
| CI | GitHub Actions |

---

## Appendix C — Contradictions vs Older Audits

| Old claim (`FINAL_AUDIT.md`) | Current reality (2026-06-05) |
|------------------------------|------------------------------|
| Mock data | ❌ Removed — HTTP only |
| No HttpOnly / lockout | ❌ Implemented |
| Jobs/Careers active | ❌ Removed from schema |
| 8 roles required | ❌ Simplified to 3 roles |
| localStorage tokens | ❌ Cookies + zustand user only |

**استخدم هذا الملف (`COMPLETE_SYSTEM_AUDIT.md`) كمرجع التدقيق الرسمي الحالي.**

---

*End of audit — analysis only, no application code was modified.*
