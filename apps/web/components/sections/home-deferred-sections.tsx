import { api } from "@/lib/api";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { DynamicHomeBody } from "@/components/sections/dynamic-home";
import { getBaseUrl } from "@/lib/api/http/client";
import { PUBLIC_PAGE_REVALIDATE } from "@/lib/public-cache";
import type { Locale } from "@/stores/ui-store";

/** Below-the-fold home sections — streamed after hero paints. */
export async function HomeDeferredSections({ locale }: { locale: Locale }) {
  const [services, projects, testimonials, posts, partners, team] =
    await Promise.all([
      fetchPublicOrEmpty(() => api.services.getAll(locale), []),
      fetchPublicOrEmpty(() => api.projects.getAll(locale), []),
      fetchPublicOrEmpty(() => api.services.getTestimonials(), []),
      fetchPublicOrEmpty(() => api.blog.getAll(locale), []),
      fetchPublicOrEmpty(async () => {
        const res = await fetch(`${getBaseUrl()}/partners`, {
          next: { revalidate: PUBLIC_PAGE_REVALIDATE },
        });
        return res.ok ? res.json() : [];
      }, []),
      fetchPublicOrEmpty(async () => {
        const res = await fetch(`${getBaseUrl()}/team-members`, {
          next: { revalidate: PUBLIC_PAGE_REVALIDATE },
        });
        return res.ok ? res.json() : [];
      }, []),
    ]);

  return (
    <DynamicHomeBody
      locale={locale}
      services={services}
      projects={projects}
      testimonials={testimonials}
      posts={posts}
      partners={partners}
      team={team}
    />
  );
}
