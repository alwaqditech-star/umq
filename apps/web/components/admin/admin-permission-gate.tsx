"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  canAccessAdminRoute,
  getAdminPathFromPathname,
  isAdminUser,
} from "@/lib/admin/rbac";
import { localePath } from "@/lib/i18n/routes";
import { useAuthStore } from "@/stores/auth-store";
import type { Locale } from "@/stores/ui-store";

export function AdminPermissionGate({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    if (!user) return;

    if (!isAdminUser(user)) {
      router.replace(localePath(locale, "/forbidden"));
      return;
    }

    const adminPath = getAdminPathFromPathname(pathname, locale);
    if (!canAccessAdminRoute(hasPermission, adminPath)) {
      router.replace(localePath(locale, "/forbidden"));
    }
  }, [user, pathname, locale, router, hasPermission]);

  if (!user || !isAdminUser(user)) {
    return null;
  }

  const adminPath = getAdminPathFromPathname(pathname, locale);
  if (!canAccessAdminRoute(hasPermission, adminPath)) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-foreground-muted">
        {locale === "ar" ? "جاري التوجيه..." : "Redirecting..."}
      </div>
    );
  }

  return <>{children}</>;
}
