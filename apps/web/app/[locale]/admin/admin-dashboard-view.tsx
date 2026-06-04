"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, FolderKanban, FileText, Layers } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { StatCard } from "@/components/admin/stat-card";
import { api } from "@/lib/api";
import { adminNavItems, filterNavByPermissions } from "@/lib/admin/nav-config";
import { getDashboardVariant } from "@umq/shared/rbac";
import { roleLabel } from "@/lib/admin/rbac";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useAuthStore } from "@/stores/auth-store";
import type { Locale } from "@/stores/ui-store";

type StatKey = "users" | "projects" | "posts" | "contacts" | "testimonials";

export function AdminDashboardView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [stats, setStats] = useState<Partial<Record<StatKey, number>>>({});
  const [loading, setLoading] = useState(true);

  const quickLinks = filterNavByPermissions(
    adminNavItems,
    hasPermission,
  ).filter((item) => item.href !== "/admin" && item.href !== "/admin/account");

  useEffect(() => {
    let cancelled = false;
    void api.cms.dashboardStats().then((remote) => {
      if (cancelled) return;
      setStats({
        users: remote.users,
        projects: remote.projects,
        posts: remote.posts,
        contacts: remote.contacts,
        testimonials: remote.testimonials,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards: {
    key: StatKey;
    label: string;
    value: number | undefined;
    icon: typeof Users;
    href: string;
    perm: string;
  }[] = [
    {
      key: "users",
      label: dict.admin.users,
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      perm: "users:read",
    },
    {
      key: "projects",
      label: dict.admin.projects,
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      perm: "projects:read",
    },
    {
      key: "posts",
      label: dict.admin.blog,
      value: stats.posts,
      icon: FileText,
      href: "/admin/blog",
      perm: "blog:read",
    },
    {
      key: "contacts",
      label: locale === "ar" ? "رسائل التواصل" : "Contacts",
      value: stats.contacts,
      icon: Layers,
      href: "/admin/contacts",
      perm: "users:read",
    },
  ];

  const roleSlug = user?.roleSlug ?? "super-admin";
  const dashboardVariant = getDashboardVariant(roleSlug);
  const dashboardTitles: Record<string, { ar: string; en: string }> = {
    "super-admin": { ar: "لوحة مدير النظام", en: "Super Admin dashboard" },
    admin: { ar: "لوحة المسؤول", en: "Admin dashboard" },
    default: { ar: "لوحة التحكم", en: "Dashboard" },
  };
  const dashTitle =
    dashboardTitles[dashboardVariant] ?? dashboardTitles.default!;

  return (
    <div>
      <FadeUp>
        <p className="text-sm text-foreground-muted">{dict.admin.overview}</p>
        <h2 className="mt-1 text-2xl font-bold">
          {locale === "ar" ? dashTitle.ar : dashTitle.en}
        </h2>
        {user && (
          <p className="mt-2 text-sm text-foreground-muted">
            {locale === "ar" ? "مرحباً" : "Welcome"},{" "}
            <span className="font-medium text-foreground">{user.name}</span>
            {" — "}
            {roleLabel(roleSlug, locale)}
          </p>
        )}
      </FadeUp>

      {loading ? (
        <p className="mt-8 text-sm text-foreground-muted">
          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards
            .filter(
              (card) => hasPermission(card.perm) && card.value !== undefined,
            )
            .map((card) => (
              <Link key={card.key} href={localePath(locale, card.href)}>
                <StatCard
                  label={card.label}
                  value={card.value ?? 0}
                  icon={card.icon}
                />
              </Link>
            ))}
        </div>
      )}

      {quickLinks.length > 0 && (
        <FadeUp className="mt-8">
          <h3 className="text-sm font-semibold text-foreground-muted">
            {locale === "ar" ? "اختصارات" : "Shortcuts"}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.key}
                href={localePath(locale, item.href)}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:border-accent/40 hover:bg-accent/5"
              >
                {dict.admin[item.key as keyof typeof dict.admin] ?? item.key}
              </Link>
            ))}
          </div>
        </FadeUp>
      )}
    </div>
  );
}
