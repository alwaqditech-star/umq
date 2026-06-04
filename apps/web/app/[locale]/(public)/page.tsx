import { Suspense } from "react";
import { DynamicHomeHero } from "@/components/sections/dynamic-home";
import { HomeDeferredSections } from "@/components/sections/home-deferred-sections";
import { PageContentSkeleton } from "@/components/ui/page-content-skeleton";
import { fetchHeroSection } from "@/lib/site-config";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";
export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const heroSection = await fetchHeroSection(locale);
  const heroContent =
    heroSection?.content && typeof heroSection.content === "object"
      ? (heroSection.content as Record<string, string>)
      : null;

  return (
    <>
      <DynamicHomeHero locale={locale} heroContent={heroContent} />
      <Suspense fallback={<PageContentSkeleton />}>
        <HomeDeferredSections locale={locale} />
      </Suspense>
    </>
  );
}
