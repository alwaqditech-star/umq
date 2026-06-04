import { EditorLayout } from "@/components/layouts/editor-layout";
import { EditorAuthGate } from "@/components/editor/editor-auth-gate";
import { EditorPermissionGate } from "@/components/editor/editor-permission-gate";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function EditorRouteLayout({
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
    <EditorLayout locale={locale}>
      <EditorAuthGate locale={locale}>
        <EditorPermissionGate locale={locale}>{children}</EditorPermissionGate>
      </EditorAuthGate>
    </EditorLayout>
  );
}
