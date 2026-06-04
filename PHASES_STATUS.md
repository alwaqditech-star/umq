# حالة المراحل — UMQ Platform

آخر تحديث: يوضح ما اكتمل وما يتبقى لإنهاء المشروع.

## ملخص سريع

| المرحلة | الحالة | ملاحظات |
|---------|--------|---------|
| 1 — Audit | ✅ | `PROJECT_AUDIT.md` |
| 2 — Database | 🟡 | MySQL + Prisma + ترحيل `omq_db` للإعدادات |
| 3 — Authentication | 🟡 | Login/refresh/JWT؛ ناقص: reset password، HttpOnly |
| 4 — Authorization | 🟢 | RBAC + حماية API + واجهة حسب الدور (هذه الجولة) |
| 5 — Dashboards | 🟢 | لوحة مخصصة لكل دور + إحصائيات حسب الصلاحية |
| 6 — Features | 🟢 | نماذج إدارة كاملة + CRUD API + contacts inbox + apply من الموقع |
| 7 — UI | 🟡 | Navbar حسب الجلسة؛ ناقص: تحسينات responsive أوسع |
| 8 — Security | 🔴 | rate limit، helmet، CSRF |
| 9 — Testing | 🔴 | unit/E2E في CI |
| 10 — Production | 🔴 | deploy + monitoring |

---

## ما اكتمل في جولة RBAC (الواجهات والأدوار)

### Backend
- رفض تسجيل الدخول لحساب بلا صلاحية لوحة التحكم (`canAccessAdminPanel`).
- CRUD إداري: `admin/projects`, `admin/blog/posts`, `admin/jobs` مع `*:manage`.

### Frontend
- **الموقع العام:** لا يظهر «لوحة التحكم» إلا للموظف المسجل؛ الزائر يرى «تسجيل الدخول» فقط.
- **بعد Login:** توجيه حسب الدور (`hr` → الطلبات، `editor` → الخدمات، …).
- **Middleware + cookies:** `umq_access` + `umq_admin_home`.
- **AdminAuthGate + AdminPermissionGate:** منع الوصول لمسارات بدون صلاحية.
- **Sidebar:** عناصر حسب `permissions`.
- **صفحات الإدارة:** أزرار إنشاء/تعديل/حذف تظهر فقط مع صلاحية `manage` المناسبة.
- **لوحة التحكم:** بطاقات وإحصائيات حسب ما يسمح به الدور.

### حسابات الاختبار (كلمة المرور: `ChangeMe123!`)

| الدور | البريد | الصفحة الافتراضية |
|-------|--------|-------------------|
| super-admin | admin@umq.sa | `/admin` |
| editor | editor@umq.sa | `/admin/services` |
| hr | hr@umq.sa | `/admin/applications` |
| viewer | viewer@umq.sa | `/admin` (قراءة فقط) |

---

## المرحلة التالية (مقترحة)

1. **Phase 3:** forgot/reset password + refresh في HttpOnly cookie.
2. **Phase 6:** صفحات `settings`، `audit`، صندوق `contacts` في اللوحة.
3. **Phase 8–9:** اختبارات E2E لتسجيل الدخول وكل دور.
4. **Phase 10:** نشر staging مع `DATABASE_URL` إنتاج.

---

## تشغيل محلي

```bash
pnpm --filter @umq/shared build
pnpm dev
```

تأكد من `.env`:

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/umq_platform"
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```
