# RBAC Restructure Plan — Corporate Website + CMS

**تاريخ:** 2026-06-05  
**الهدف:** تحويل المنصة من ERP/HR/Recruitment إلى موقع شركة + CMS فقط.

---

## 1. الأدوار الجديدة (3 فقط)

| Slug          | الاسم       | لوحة التحكم                                     |
| ------------- | ----------- | ----------------------------------------------- |
| `super-admin` | Super Admin | `/admin` — كامل الصلاحيات                       |
| `admin`       | Admin       | `/admin` — CMS + محتوى (بدون users/roles/audit) |
| `editor`      | Editor      | `/editor` — محتوى محدود (blog, projects, media) |

## 2. أدوار تُحذف نهائياً

`manager`, `hr`, `employee`, `customer`, `viewer` (+ أي slug قديم: `project_manager`, `content_manager`)

- حذف من **seed**
- حذف من **DB** عبر migration (users + role_permissions + roles)
- إزالة **customer portal** بالكامل

---

## 3. نظام التوظيف — حذف كامل

### Prisma / MySQL

| يُحذف                    |                  |
| ------------------------ | ---------------- |
| `JobCategory`            | `job_categories` |
| `Job`                    | `jobs`           |
| `Application`            | `applications`   |
| `ApplicationStatus` enum |                  |

### NestJS (حذف modules)

- `apps/api/src/jobs/`
- `apps/api/src/applications/`
- `JobCategoriesAdminController` + job methods في `categories`

### Next.js (حذف pages)

- `/[locale]/careers`, `/[locale]/careers/[slug]`
- `/[locale]/admin/jobs`, `/[locale]/admin/applications`
- روابط careers في Navbar / dictionaries

### Web API client

- `jobs`, `applications`, `categories.jobs`, `httpCustomer`

---

## 4. إخفاء الإدارة من الموقع العام

| العنصر                              | الإجراء                           |
| ----------------------------------- | --------------------------------- |
| `PublicNavAuth` (Login / Dashboard) | إزالة من Navbar والقائمة الجوالية |
| روابط careers                       | إزالة                             |
| Footer admin links                  | التحقق — لا روابط إدارة           |

**الدخول:** فقط عبر `/[locale]/login` (رابط مباشر — غير معروض في الهيدر).

---

## 5. Auth & Redirects

| الحالة                              | السلوك                            |
| ----------------------------------- | --------------------------------- |
| زائر → `/admin` أو `/editor`        | → `/login`                        |
| `/login` + مسجل                     | → `/admin` أو `/editor` حسب الدور |
| `super-admin` / `admin` → `/editor` | → `/admin` (اختياري) أو 403       |
| `editor` → `/admin`                 | → `/forbidden`                    |
| بدون صلاحية                         | `/forbidden`                      |

Cookie `umq_admin_home`: يخزن `/admin` أو `/editor`.

---

## 6. صلاحيات (Seed)

### Super Admin

جميع الـ permissions (`*` في JWT).

### Admin

`services`, `projects`, `blog`, `cms:read`, `cms:manage`, `settings:manage` — **بدون** `users:*`, `roles:*`, `audit:read`.

### Editor

`blog:read`, `blog:manage`, `projects:read`, `projects:manage`, `cms:read`, `cms:manage` (للوسائط والمحتوى — بدون settings/audit في UI).

---

## 7. لوحات التحكم

| الدور       | المسار    | Sidebar                        |
| ----------- | --------- | ------------------------------ |
| Super Admin | `/admin`  | كامل                           |
| Admin       | `/admin`  | بدون users/roles/audit         |
| Editor      | `/editor` | blog, projects, media, account |

صفحات Editor تعيد استخدام مكوّنات admin عبر re-export حيث أمكن.

---

## 8. CMS — الإبقاء والربط

**يبقى مربوطاً بـ MySQL:**

Blog, Projects, Services, Media, SEO, Settings, Website Sections, Partners, Testimonials, Team, Contacts (inbox لـ super-admin), Audit (super-admin فقط).

---

## 9. ملفات التوثيق النهائية

- `docs/RBAC_FINAL_REPORT.md`
- `docs/SECURITY_NAVIGATION_AUDIT.md`
- `docs/REMOVED_MODULES_REPORT.md`
- `docs/PRODUCTION_READINESS_REPORT.md`
- تحديث `README.md`, `CURRENT_STATUS.md`

---

## 10. التحقق

```bash
pnpm lint
pnpm check-types
pnpm build
pnpm --filter @umq/database db:migrate:deploy
pnpm db:seed
```
