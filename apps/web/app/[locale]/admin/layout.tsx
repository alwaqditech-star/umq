import { AdminLayout } from "@/components/layouts/admin-layout";
import { AdminAuthGate } from "@/components/admin/admin-auth-gate";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function AdminRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return (
    <AdminLayout locale={locale}>
      <AdminAuthGate locale={locale}>{children}</AdminAuthGate>
    </AdminLayout>
  );
}
