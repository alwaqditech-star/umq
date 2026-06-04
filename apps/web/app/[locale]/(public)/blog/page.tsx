import { api } from "@/lib/api";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { isBlogSectionEnabled } from "@/lib/site-config";
import { BlogPageClient } from "@/app/[locale]/(public)/blog/blog-client";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";
import type { Metadata } from "next";
import { fetchSeo } from "@/lib/site-config";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const seo = await fetchSeo("/blog", localeParam);
  return {
    title:
      seo?.title ?? (localeParam === "ar" ? "المدونة | عُمْق" : "Blog | UMQ"),
    description: seo?.description,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  if (!(await isBlogSectionEnabled())) {
    notFound();
  }

  const posts = await fetchPublicOrEmpty(() => api.blog.getAll(locale), []);

  return <BlogPageClient locale={locale} posts={posts} />;
}
