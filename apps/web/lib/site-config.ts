import { getBaseUrl } from "@/lib/api/http/client";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import type { HomeSectionKey } from "@umq/shared";

export interface HomeSectionConfig {
  key: string;
  labelAr: string;
  labelEn: string;
  sortOrder: number;
}

export interface ContactInfoSettings {
  email: string;
  phone: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  hoursAr: string;
  hoursEn: string;
  mapEmbedUrl?: string;
}

const DEFAULT_SECTIONS: HomeSectionConfig[] = [
  { key: "hero", labelAr: "الواجهة", labelEn: "Hero", sortOrder: 0 },
  { key: "services", labelAr: "الخدمات", labelEn: "Services", sortOrder: 10 },
  { key: "projects", labelAr: "المشاريع", labelEn: "Projects", sortOrder: 20 },
  { key: "blog", labelAr: "المدونة", labelEn: "Blog", sortOrder: 30 },
  { key: "testimonials", labelAr: "آراء العملاء", labelEn: "Testimonials", sortOrder: 40 },
];

async function serverGet<T>(path: string, fallback: T): Promise<T> {
  return fetchPublicOrEmpty(async () => {
    try {
      const res = await fetch(`${getBaseUrl()}${path}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return fallback;
      return (await res.json()) as T;
    } catch {
      return fallback;
    }
  }, fallback);
}

export async function fetchHomeSections(): Promise<HomeSectionConfig[]> {
  return serverGet<HomeSectionConfig[]>("/home-sections", DEFAULT_SECTIONS);
}

export async function fetchPublicSettings(): Promise<{
  contact: ContactInfoSettings;
}> {
  const data = await serverGet<Record<string, unknown>>("/settings/public", {});
  const contact = (data["contact.info"] ?? {}) as Partial<ContactInfoSettings>;
  return {
    contact: {
      email: contact.email ?? "info@umq.sa",
      phone: contact.phone ?? "+966 11 000 0000",
      whatsapp: contact.whatsapp ?? "+966500000000",
      addressAr: contact.addressAr ?? "الرياض، المملكة العربية السعودية",
      addressEn: contact.addressEn ?? "Riyadh, Saudi Arabia",
      hoursAr: contact.hoursAr ?? "الأحد – الخميس، 9 ص – 6 م",
      hoursEn: contact.hoursEn ?? "Sun – Thu, 9 AM – 6 PM",
      mapEmbedUrl: contact.mapEmbedUrl,
    },
  };
}

export function buildEnabledSet(sections: HomeSectionConfig[]): Set<string> {
  return new Set(sections.map((s) => s.key));
}

export function isSectionEnabled(
  enabled: Set<string>,
  key: HomeSectionKey,
): boolean {
  return enabled.has(key);
}

export async function fetchHeroSection(locale: string) {
  return serverGet<{ content?: Record<string, string> } | null>(
    `/website-sections/home.hero?locale=${locale}`,
    null,
  );
}

export async function fetchFaqSection(locale: string) {
  return serverGet<{ content?: { items?: { q: string; a: string }[] } } | null>(
    `/website-sections/contact.faq?locale=${locale}`,
    null,
  );
}

export async function fetchSeo(path: string, locale: string) {
  return serverGet<{
    title: string;
    description?: string;
    canonical?: string;
    robots?: string;
  } | null>(`/seo?path=${encodeURIComponent(path)}&locale=${locale}`, null);
}
