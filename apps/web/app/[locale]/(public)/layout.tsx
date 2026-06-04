import { PublicLayout } from "@/components/layouts/public-layout";
import { SiteConfigProvider } from "@/providers/site-config-provider";
import { fetchPublicOrEmpty } from "@/lib/api/server-fetch";
import { fetchHomeSections, fetchPublicSettings } from "@/lib/site-config";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export const dynamic = "force-dynamic";

export default async function PublicRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const [sections, settings] = await Promise.all([
    fetchPublicOrEmpty(() => fetchHomeSections(), []),
    fetchPublicOrEmpty(() => fetchPublicSettings(), {
      contact: {
        email: "info@umq.sa",
        phone: "+966 11 000 0000",
        whatsapp: "+966500000000",
        addressAr: "الرياض، المملكة العربية السعودية",
        addressEn: "Riyadh, Saudi Arabia",
        hoursAr: "الأحد – الخميس، 9 ص – 6 م",
        hoursEn: "Sun – Thu, 9 AM – 6 PM",
      },
    }),
  ]);
  const { contact } = settings;

  return (
    <SiteConfigProvider sections={sections} contact={contact}>
      <PublicLayout locale={localeParam as Locale}>{children}</PublicLayout>
    </SiteConfigProvider>
  );
}
