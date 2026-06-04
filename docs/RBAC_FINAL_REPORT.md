# RBAC Final Report

**تاريخ:** 2026-06-05

## الأدوار المعتمدة (3)

| Slug          | Panel     | صلاحيات                                                   |
| ------------- | --------- | --------------------------------------------------------- |
| `super-admin` | `/admin`  | كامل — users, roles, audit, CMS, محتوى                    |
| `admin`       | `/admin`  | CMS + services/projects/blog — **بدون** users/roles/audit |
| `editor`      | `/editor` | blog, projects, media, account                            |

## التحويل بعد Login

| Role        | Redirect           |
| ----------- | ------------------ |
| super-admin | `/[locale]/admin`  |
| admin       | `/[locale]/admin`  |
| editor      | `/[locale]/editor` |

Cookie `umq_admin_home` يخزن `/admin` أو `/editor` للـ middleware.

## الحماية

- Middleware: `/admin` و `/editor` تتطلب `umq_access`
- `AdminAuthGate`: يرفض editor → يوجّه لـ `/editor`
- `EditorAuthGate`: يرفض admin/super-admin → يوجّه لـ `/admin`
- `AdminPermissionGate` / `EditorPermissionGate`: 403 عند نقص permission
- API: `canSignIn()` يسمح فقط بالأدوار الثلاثة

## Seed users

| Email             | Role        |
| ----------------- | ----------- |
| admin@umq.sa      | super-admin |
| operations@umq.sa | admin       |
| editor@umq.sa     | editor      |
