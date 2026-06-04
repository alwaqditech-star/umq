"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { editorNavItems } from "@/lib/editor/nav-config";
import { localePath } from "@/lib/i18n/routes";
import { useAuthStore } from "@/stores/auth-store";
import type { Locale } from "@/stores/ui-store";

function canAccessEditorRoute(
  hasPermission: (perm: string) => boolean,
  editorPath: string,
): boolean {
  if (editorPath === "/editor" || editorPath === "/editor/") return true;
  const item = editorNavItems.find(
    (nav) => nav.href !== "/editor" && editorPath.startsWith(nav.href),
  );
  if (!item) return true;
  if (item.permissions.length === 0) return true;
  return item.permissions.some((perm) => hasPermission(perm));
}

export function EditorPermissionGate({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    const prefix = `/${locale}`;
    const editorPath = pathname.startsWith(prefix)
      ? pathname.slice(prefix.length) || "/"
      : pathname;
    if (!canAccessEditorRoute(hasPermission, editorPath)) {
      router.replace(localePath(locale, "/forbidden"));
    }
  }, [pathname, locale, router, hasPermission]);

  const prefix = `/${locale}`;
  const editorPath = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length) || "/"
    : pathname;

  if (!canAccessEditorRoute(hasPermission, editorPath)) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-foreground-muted">
        {locale === "ar" ? "جاري التوجيه..." : "Redirecting..."}
      </div>
    );
  }

  return <>{children}</>;
}
