import { api } from "@/lib/api";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { ServicesPageClient } from "./services-client";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export const revalidate = 60;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const services = await fetchPublicOrEmpty(
    () => api.services.getAll(localeParam),
    [],
  );
  return (
    <ServicesPageClient locale={localeParam as Locale} services={services} />
  );
}
