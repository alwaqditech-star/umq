# Security & Navigation Audit

**تاريخ:** 2026-06-05

## الموقع العام

| عنصر | الحالة |
|------|--------|
| زر Login في Header | ✅ **محذوف** |
| زر Dashboard في Header | ✅ **محذوف** |
| `PublicNavAuth` | ✅ **محذوف** |
| رابط Careers | ✅ **محذوف** |
| بوابة Customer | ✅ **محذوفة** بالكامل |

الزوار يرون فقط: Home, About, Services, Projects, Blog, Contact.

## الدخول للموظفين

- الوصول الوحيد: `https://host/[locale]/login` (رابط مباشر — غير معروض علناً)
- بعد النجاح: redirect حسب الدور
- `/login` مع جلسة نشطة: redirect تلقائي للوحة المناسبة

## JWT & Cookies

- HttpOnly `umq_access` / `umq_refresh` (بدون تغيير في هذه المرحلة)
- `canSignIn` على API يمنع أدوار محذوفة حتى لو بقيت في DB

## توصيات لاحقة

- CSRF token للـ cookie auth
- إخفاء `/login` من sitemap و robots إن لزم
- Rate limit على login (موجود جزئياً)
