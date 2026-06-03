"use client";

import { Users, FolderKanban, FileText, Briefcase, Inbox } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { StatCard } from "@/components/admin/stat-card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function AdminDashboardClient({
  locale,
  stats,
}: {
  locale: Locale;
  stats: {
    users: number;
    projects: number;
    posts: number;
    jobs: number;
    applications: number;
  };
}) {
  const dict = getDictionary(locale);

  const cards = [
    { label: dict.admin.users, value: stats.users, icon: Users },
    { label: dict.admin.projects, value: stats.projects, icon: FolderKanban },
    { label: dict.admin.blog, value: stats.posts, icon: FileText },
    { label: dict.admin.jobs, value: stats.jobs, icon: Briefcase },
    {
      label: dict.admin.applications,
      value: stats.applications,
      icon: Inbox,
    },
  ];

  return (
    <div>
      <FadeUp>
        <p className="text-sm text-foreground-muted">{dict.admin.overview}</p>
        <h2 className="mt-1 text-2xl font-bold">{dict.admin.dashboard}</h2>
      </FadeUp>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <FadeUp className="mt-8 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-6 text-sm text-foreground-muted">
        {locale === "ar"
          ? "وضع تجريبي — البيانات من طبقة Mock API. عند ربط NestJS، يتم التبديل من lib/api/index.ts فقط."
          : "Mock mode — data from the Mock API layer. When NestJS is connected, switch only lib/api/index.ts."}
      </FadeUp>
    </div>
  );
}
