# نشر UMQ على Vercel

## لماذا يظهر `FUNCTION_INVOCATION_FAILED`؟

عادةً أحد الأسباب التالية:

1. **Monorepo**: المشروع يعتمد على `@umq/shared` من `packages/shared` — بدون أوامر بناء من جذر المستودع يفشل التشغيل على Vercel.
2. **لا يوجد API**: الواجهة على Vercel تحتاج NestJS + MySQL **على خادم آخر** (Railway, Render, VPS, …). بدون `API_INTERNAL_URL` الصفحات كانت قد تتعطل عند أخطاء غير متوقعة.

---

## إعداد مشروع Vercel (مهم)

| الإعداد              | القيمة                                               |
| -------------------- | ---------------------------------------------------- |
| **Root Directory**   | `apps/web`                                           |
| **Framework Preset** | Next.js                                              |
| **Install Command**  | `cd ../.. && pnpm install --frozen-lockfile`         |
| **Build Command**    | `cd ../.. && pnpm turbo run build --filter=@umq/web` |

ملف `apps/web/vercel.json` يضبط Install/Build تلقائياً إن لم تُغيّرها يدوياً.

---

## متغيرات البيئة على Vercel

### الحد الأدنى (موقع يعمل بدون API — بيانات افتراضية)

```env
NEXT_PUBLIC_API_URL=/api/v1
NODE_ENV=production
```

> بدون API خارجي: الصفحة الرئيسية والأقسام تستخدم القيم الافتراضية؛ لوحة التحكم والمحتوى الحقيقي لن يعملا.

### الإنتاج الكامل (موقع + API منفصل)

على **Vercel (Web)**:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
API_INTERNAL_URL=https://api.your-domain.com
WEB_ORIGIN=https://umq-nine.vercel.app
```

على **خادم الـ API** (ليس Vercel):

```env
DATABASE_URL=mysql://...
JWT_SECRET=<strong-secret>
CORS_ORIGIN=https://umq-nine.vercel.app
WEB_ORIGIN=https://umq-nine.vercel.app
AUTH_COOKIE_SECURE=true
PUBLIC_API_URL=https://api.your-domain.com/api/v1
```

**لا تضع** `API_INTERNAL_URL` على `127.0.0.1` في Vercel — لا يوجد NestJS على نفس الحاوية.

---

## خطوات سريعة

1. ادفع التحديثات إلى GitHub (يشمل `vercel.json` و `outputFileTracingRoot`).
2. في Vercel → Project → **Settings** → General → Root Directory = `apps/web`.
3. Environment Variables → أضف المتغيرات أعلاه.
4. **Redeploy** (Deployments → ⋮ → Redeploy).
5. انشر الـ API على Railway/Render وربط `API_INTERNAL_URL` بعنوانه العام.

---

## التحقق

- `https://your-app.vercel.app/ar` — يجب أن تفتح (حتى بدون API).
- `https://your-api/api/v1/health` — يجب `200` قبل ربط الإنتاج الكامل.

---

## سجلات الأخطاء

Vercel → Project → **Deployments** → آخر نشر → **Functions** / \*\*Runtime Logs  
ابحث عن `Cannot find module '@umq/shared'` أو `ECONNREFUSED 127.0.0.1:4001`.
