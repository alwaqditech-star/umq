"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/navigation/navigation-progress";
import { adminNavItems, filterNavByPermissions } from "@/lib/admin/nav-config";

export function AdminLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { toggleAdminSidebar, toggleTheme, theme, navPending } = useUiStore();
  const clearSession = useAuthStore((s) => s.clearSession);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleLogout = async () => {
    await api.auth.logout();
    clearSession();
    router.push(localePath(locale, "/login"));
  };

  const segment = pathname.split("/").filter(Boolean).pop();
  const titleMap: Record<string, string> = {
    admin: dict.admin.dashboard,
    users: dict.admin.users,
    roles: dict.admin.roles,
    services: dict.admin.services,
    projects: dict.admin.projects,
    blog: dict.admin.blog,
    contacts: locale === "ar" ? "رسائل التواصل" : "Contacts",
    categories: locale === "ar" ? "التصنيفات" : "Categories",
    testimonials: locale === "ar" ? "آراء العملاء" : "Testimonials",
    media: locale === "ar" ? "الوسائط" : "Media",
    audit: locale === "ar" ? "التدقيق" : "Audit",
    account: locale === "ar" ? "الحساب" : "Account",
  };
  const pageTitle = titleMap[segment ?? "admin"] ?? dict.admin.dashboard;

  const navLabels: Record<string, string> = {
    dashboard: dict.admin.dashboard,
    users: dict.admin.users,
    roles: dict.admin.roles,
    services: dict.admin.services,
    projects: dict.admin.projects,
    blog: dict.admin.blog,
    contacts: locale === "ar" ? "رسائل التواصل" : "Contacts",
    account: locale === "ar" ? "الحساب" : "Account",
    categories: locale === "ar" ? "التصنيفات" : "Categories",
    testimonials: locale === "ar" ? "آراء العملاء" : "Testimonials",
    audit: locale === "ar" ? "التدقيق" : "Audit",
    media: locale === "ar" ? "الوسائط" : "Media",
    websiteSections: locale === "ar" ? "أقسام الموقع" : "Website sections",
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Sidebar
        locale={locale}
        homeHref="/admin"
        navItems={filterNavByPermissions(adminNavItems, hasPermission)}
        labels={navLabels}
        panelLabel="Admin navigation"
      />
      <div className="flex min-w-0 flex-1 flex-col lg:ps-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 hover:bg-accent/10 lg:hidden"
              onClick={toggleAdminSidebar}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs text-foreground-muted">
                {user?.name ?? dict.admin.welcome}
                {user?.role ? ` · ${user.role}` : ""}
              </p>
              <h1 className="text-lg font-semibold text-foreground">
                {pageTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-foreground-muted hover:bg-accent/10"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleLogout()}
            >
              <LogOut className="h-4 w-4" />
              {dict.admin.logout}
            </Button>
            <Link href={localePath(locale, "")}>
              <Button variant="ghost" size="sm">
                {dict.nav.home}
              </Button>
            </Link>
          </div>
        </header>
        <main
          className={cn(
            "flex-1 p-4 transition-opacity duration-150 sm:p-6 lg:p-8",
            navPending && "pointer-events-none opacity-60",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
