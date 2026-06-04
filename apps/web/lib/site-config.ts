import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getBaseUrl } from "@/lib/api/http/client";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { PUBLIC_PAGE_REVALIDATE } from "@/lib/public-cache";
import type { HomeSectionKey } from "@umq/shared";
import {
  DEFAULT_CONTACT,
  DEFAULT_HOME_SECTIONS,
  type ContactInfoSettings,
  type HomeSectionConfig,
} from "@/lib/site-config.defaults";

export type {
  ContactInfoSettings,
  HomeSectionConfig,
} from "@/lib/site-config.defaults";
export {
  DEFAULT_CONTACT,
  DEFAULT_HOME_SECTIONS,
  parseContactFromPublicSettings,
} from "@/lib/site-config.defaults";

async function serverGet<T>(path: string, fallback: T): Promise<T> {
  return fetchPublicOrEmpty(async () => {
    try {
      const res = await fetch(`${getBaseUrl()}${path}`, {
        next: { revalidate: PUBLIC_PAGE_REVALIDATE },
      });
      if (!res.ok) return fallback;
      return (await res.json()) as T;
    } catch {
      return fallback;
    }
  }, fallback);
}

async function loadHomeSections(): Promise<HomeSectionConfig[]> {
  const rows = await serverGet<HomeSectionConfig[]>(
    "/home-sections",
    DEFAULT_HOME_SECTIONS,
  );
  return rows.length > 0 ? rows : DEFAULT_HOME_SECTIONS;
}

async function loadPublicSettings(): Promise<{
  contact: ContactInfoSettings;
}> {
  const data = await serverGet<Record<string, unknown>>("/settings/public", {});
  const contact = (data["contact.info"] ?? {}) as Partial<ContactInfoSettings>;
  return {
    contact: {
      email: contact.email ?? DEFAULT_CONTACT.email,
      phone: contact.phone ?? DEFAULT_CONTACT.phone,
      whatsapp: contact.whatsapp ?? DEFAULT_CONTACT.whatsapp,
      addressAr: contact.addressAr ?? DEFAULT_CONTACT.addressAr,
      addressEn: contact.addressEn ?? DEFAULT_CONTACT.addressEn,
      hoursAr: contact.hoursAr ?? DEFAULT_CONTACT.hoursAr,
      hoursEn: contact.hoursEn ?? DEFAULT_CONTACT.hoursEn,
      mapEmbedUrl: contact.mapEmbedUrl,
    },
  };
}

const cachedHomeSections = unstable_cache(
  loadHomeSections,
  ["umq-home-sections"],
  { revalidate: PUBLIC_PAGE_REVALIDATE, tags: ["home-sections"] },
);

const cachedPublicSettings = unstable_cache(
  loadPublicSettings,
  ["umq-public-settings"],
  { revalidate: PUBLIC_PAGE_REVALIDATE, tags: ["public-settings"] },
);

export const fetchHomeSections = cache(cachedHomeSections);
export const fetchPublicSettings = cache(cachedPublicSettings);

export const isBlogSectionEnabled = cache(async (): Promise<boolean> => {
  const sections = await fetchHomeSections();
  return sections.some((s) => s.key === "blog");
});

export function buildEnabledSet(sections: HomeSectionConfig[]): Set<string> {
  return new Set(sections.map((s) => s.key));
}

export function isSectionEnabled(
  enabled: Set<string>,
  key: HomeSectionKey,
): boolean {
  return enabled.has(key);
}

export const fetchHeroSection = cache((locale: string) =>
  unstable_cache(
    () =>
      serverGet<{ content?: Record<string, string> } | null>(
        `/website-sections/home.hero?locale=${locale}`,
        null,
      ),
    ["umq-hero", locale],
    { revalidate: PUBLIC_PAGE_REVALIDATE, tags: [`hero-${locale}`] },
  )(),
);

export const fetchFaqSection = cache((locale: string) =>
  unstable_cache(
    () =>
      serverGet<{ content?: { items?: { q: string; a: string }[] } } | null>(
        `/website-sections/contact.faq?locale=${locale}`,
        null,
      ),
    ["umq-faq", locale],
    { revalidate: PUBLIC_PAGE_REVALIDATE, tags: [`faq-${locale}`] },
  )(),
);

export const fetchSeo = cache((path: string, locale: string) =>
  unstable_cache(
    () =>
      serverGet<{
        title: string;
        description?: string;
        canonical?: string;
        robots?: string;
      } | null>(`/seo?path=${encodeURIComponent(path)}&locale=${locale}`, null),
    ["umq-seo", path, locale],
    { revalidate: PUBLIC_PAGE_REVALIDATE, tags: [`seo-${path}-${locale}`] },
  )(),
);
