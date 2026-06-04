import { api } from "@/lib/api";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { DynamicHome } from "@/components/sections/dynamic-home";
import { fetchHeroSection } from "@/lib/site-config";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";
import { getBaseUrl } from "@/lib/api/http/client";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const [services, projects, testimonials, posts, partners, team, heroSection] =
    await Promise.all([
      fetchPublicOrEmpty(() => api.services.getAll(locale), []),
      fetchPublicOrEmpty(() => api.projects.getAll(locale), []),
      fetchPublicOrEmpty(() => api.services.getTestimonials(), []),
      fetchPublicOrEmpty(() => api.blog.getAll(locale), []),
      fetchPublicOrEmpty(async () => {
        const res = await fetch(`${getBaseUrl()}/partners`);
        return res.ok ? res.json() : [];
      }, []),
      fetchPublicOrEmpty(async () => {
        const res = await fetch(`${getBaseUrl()}/team-members`);
        return res.ok ? res.json() : [];
      }, []),
      fetchHeroSection(locale),
    ]);

  const heroContent =
    heroSection?.content && typeof heroSection.content === "object"
      ? (heroSection.content as Record<string, string>)
      : null;

  return (
    <DynamicHome
      locale={locale}
      services={services}
      projects={projects}
      testimonials={testimonials}
      posts={posts}
      partners={partners}
      team={team}
      heroContent={heroContent}
    />
  );
}
