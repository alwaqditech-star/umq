"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, FolderKanban, ImageIcon } from "lucide-react";
import { api } from "@/lib/api";
import {
  filterNavByPermissions,
  editorNavItems,
} from "@/lib/editor/nav-config";
import { localePath } from "@/lib/i18n/routes";
import { useLocale } from "@/lib/i18n/use-locale";
import { useAuthStore } from "@/stores/auth-store";
import { Card } from "@/components/ui/card";

export default function EditorDashboardPage() {
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [stats, setStats] = useState<{ posts?: number; projects?: number }>({});

  useEffect(() => {
    void api.cms.dashboardStats().then((s) => {
      setStats({ posts: s.posts, projects: s.projects });
    });
  }, []);

  const links = filterNavByPermissions(editorNavItems, hasPermission).filter(
    (item) => item.href !== "/editor" && item.href !== "/editor/account",
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === "ar" ? "لوحة المحرر" : "Editor dashboard"}
        </h1>
        <p className="mt-2 text-foreground-muted">
          {locale === "ar"
            ? `مرحباً ${user?.name ?? ""} — إنشاء وتحرير المحتوى فقط`
            : `Welcome ${user?.name ?? ""} — create and edit content`}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.posts !== undefined && (
          <Card className="p-6">
            <p className="text-sm text-foreground-muted">
              {locale === "ar" ? "مقالات" : "Blog posts"}
            </p>
            <p className="mt-2 text-3xl font-bold">{stats.posts}</p>
          </Card>
        )}
        {stats.projects !== undefined && (
          <Card className="p-6">
            <p className="text-sm text-foreground-muted">
              {locale === "ar" ? "مشاريع" : "Projects"}
            </p>
            <p className="mt-2 text-3xl font-bold">{stats.projects}</p>
          </Card>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => {
          const Icon =
            item.key === "blog"
              ? FileText
              : item.key === "projects"
                ? FolderKanban
                : ImageIcon;
          return (
            <Link
              key={item.key}
              href={localePath(locale, item.href)}
              className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40"
            >
              <Icon className="h-6 w-6 text-accent" />
              <p className="mt-3 font-semibold">{item.key}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
