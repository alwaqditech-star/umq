import { PublicLayout } from "@/components/layouts/public-layout";
import { SiteConfigProvider } from "@/providers/site-config-provider";
import {
  DEFAULT_CONTACT,
  DEFAULT_HOME_SECTIONS,
} from "@/lib/site-config.defaults";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

/** Layout is synchronous — site config hydrates on the client so navigation is instant. */
export default async function PublicRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  return (
    <SiteConfigProvider
      sections={DEFAULT_HOME_SECTIONS}
      contact={DEFAULT_CONTACT}
      hydrateFromApi
    >
      <PublicLayout locale={localeParam as Locale}>{children}</PublicLayout>
    </SiteConfigProvider>
  );
}
