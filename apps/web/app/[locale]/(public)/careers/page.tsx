import { api } from "@/lib/api";
import { CareersPageClient } from "./careers-client";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const jobs = await api.jobs.getAll();
  return <CareersPageClient locale={localeParam as Locale} jobs={jobs} />;
}
