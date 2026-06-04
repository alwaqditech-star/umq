import {
  canAccessAdminPanel,
  canAccessEditorPanel,
  canSignIn,
  getPostLoginPath,
} from "@umq/shared/rbac";
import type { AuthUser } from "@/lib/api/interfaces/auth.service";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";
import { adminNavItems, type AdminNavItem } from "./nav-config";

export { canAccessAdminPanel, canAccessEditorPanel, canSignIn };

export function getPostLoginPathForLocale(
  roleSlug: string,
  locale: Locale,
): string {
  return localePath(locale, getPostLoginPath(roleSlug));
}

/** @deprecated Use getPostLoginPathForLocale */
export function getDefaultAdminPath(roleSlug: string, locale: Locale): string {
  return getPostLoginPathForLocale(roleSlug, locale);
}

export function isAdminUser(user: AuthUser | null): boolean {
  return canAccessAdminPanel(user?.permissions ?? [], user?.roleSlug);
}

export function isEditorUser(user: AuthUser | null): boolean {
  return canAccessEditorPanel(user?.permissions ?? [], user?.roleSlug);
}

export function getAdminPathFromPathname(
  pathname: string,
  locale: Locale,
): string {
  const prefix = `/${locale}`;
  if (!pathname.startsWith(prefix)) return pathname;
  const rest = pathname.slice(prefix.length) || "/";
  if (rest.startsWith("/admin")) return rest;
  if (rest.startsWith("/editor")) return rest;
  return "/admin";
}

export function findNavItemForAdminPath(
  adminPath: string,
): AdminNavItem | undefined {
  if (adminPath === "/admin" || adminPath === "/admin/") {
    return adminNavItems.find((item) => item.href === "/admin");
  }
  return adminNavItems.find(
    (item) => item.href !== "/admin" && adminPath.startsWith(item.href),
  );
}

export function canAccessAdminRoute(
  hasPermission: (perm: string) => boolean,
  adminPath: string,
): boolean {
  const item = findNavItemForAdminPath(adminPath);
  if (!item) return true;
  if (item.permissions.length === 0) return true;
  return item.permissions.some((perm) => hasPermission(perm));
}

export const ROLE_LABELS: Record<string, { ar: string; en: string }> = {
  "super-admin": { ar: "مدير النظام", en: "Super Admin" },
  admin: { ar: "مسؤول المحتوى", en: "Admin" },
  editor: { ar: "محرر المحتوى", en: "Editor" },
};

export function roleLabel(roleSlug: string, locale: Locale): string {
  const labels = ROLE_LABELS[roleSlug];
  if (!labels) return roleSlug;
  return locale === "ar" ? labels.ar : labels.en;
}
