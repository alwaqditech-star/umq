import { api } from "@/lib/api";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { BlogDetailClient } from "@/components/blog/blog-detail-client";
import { fetchSeo, isBlogSectionEnabled } from "@/lib/site-config";
import { isValidLocale } from "@/lib/i18n/routes";
import { localized } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const path = `/blog/${slug}`;

  try {
    const [post, seo] = await Promise.all([
      api.blog.getBySlug!(slug, locale),
      fetchSeo(path, locale),
    ]);
    const title = seo?.title ?? localized(locale, post, "titleAr", "titleEn");
    const description =
      seo?.description ?? localized(locale, post, "excerptAr", "excerptEn");
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  if (!(await isBlogSectionEnabled())) {
    notFound();
  }

  let post;
  try {
    post = await api.blog.getBySlug!(slug, locale);
  } catch {
    notFound();
  }

  const related = await fetchPublicOrEmpty(
    () => api.blog.getRelated!(slug, locale),
    [],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: localized(locale, post, "titleAr", "titleEn"),
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    description: localized(locale, post, "excerptAr", "excerptEn"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient locale={locale} post={post} related={related} />
    </>
  );
}
