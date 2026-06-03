import { api } from "@/lib/api";
import { AdminDashboardClient } from "./dashboard-client";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const [users, projects, posts, jobs, applications] = await Promise.all([
    api.users.getAll(),
    api.projects.getAll(),
    api.blog.getAll(),
    api.jobs.getAll(),
    api.jobs.getApplications(),
  ]);

  return (
    <AdminDashboardClient
      locale={localeParam as Locale}
      stats={{
        users: users.length,
        projects: projects.length,
        posts: posts.length,
        jobs: jobs.length,
        applications: applications.length,
      }}
    />
  );
}
