import { api } from "@/lib/api";
import { HomePageContent } from "@/components/sections/home-page-content";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [services, projects, testimonials] = await Promise.all([
    api.services.getAll(),
    api.projects.getAll(),
    api.services.getTestimonials(),
  ]);

  return (
    <HomePageContent
      locale={locale}
      services={services}
      projects={projects}
      testimonials={testimonials}
    />
  );
}
