import { notFound } from "next/navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { LocaleSync } from "@/components/locale-sync";
import { getDirection, isValidLocale } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dir = getDirection(locale);

  return (
    <div lang={locale} dir={dir} data-locale={locale}>
      <LocaleSync locale={locale} />
      <AppProviders initialTheme="light">{children}</AppProviders>
    </div>
  );
}
