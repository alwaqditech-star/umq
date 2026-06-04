"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useLocale } from "@/lib/i18n/use-locale";
import { getDefaultAdminPath } from "@/lib/admin/rbac";
import { PremiumErrorPage } from "@/components/errors/premium-error-page";

export default function ForbiddenPage() {
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const roleSlug = user?.roleSlug ?? user?.role ?? "";
  const dashboardPath = getDefaultAdminPath(roleSlug, locale);

  return (
    <PremiumErrorPage
      code="403"
      titleAr="غير مصرح"
      titleEn="Access denied"
      messageAr="ليس لديك صلاحية للوصول إلى هذه الصفحة."
      messageEn="You don't have permission to access this page."
      actions={[
        { href: "", labelAr: "الرئيسية", labelEn: "Home" },
        {
          href: dashboardPath,
          labelAr: "لوحة التحكم",
          labelEn: "Dashboard",
        },
      ]}
    />
  );
}
