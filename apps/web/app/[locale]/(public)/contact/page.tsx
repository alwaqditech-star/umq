import { ContactPageClient } from "@/components/contact/contact-page-client";
import { fetchFaqSection } from "@/lib/site-config";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const faq = await fetchFaqSection(locale).catch(() => null);
  const items =
    faq?.content?.items && Array.isArray(faq.content.items)
      ? (faq.content.items as { q: string; a: string }[])
      : [];

  return <ContactPageClient faqItems={items} />;
}
