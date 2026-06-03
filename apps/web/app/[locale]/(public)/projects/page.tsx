import { api } from "@/lib/api";
import { ProjectsPageClient } from "./projects-client";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const projects = await api.projects.getAll();
  return (
    <ProjectsPageClient locale={localeParam as Locale} projects={projects} />
  );
}
