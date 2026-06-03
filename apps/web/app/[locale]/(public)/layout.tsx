import { PublicLayout } from "@/components/layouts/public-layout";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

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
    <PublicLayout locale={localeParam as Locale}>{children}</PublicLayout>
  );
}
