"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layouts/footer";
import type { Locale } from "@/stores/ui-store";

export function PublicLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
