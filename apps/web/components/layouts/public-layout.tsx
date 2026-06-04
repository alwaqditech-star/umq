"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layouts/footer";
import { NavigationProgress } from "@/components/navigation/navigation-progress";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function PublicLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const navPending = useUiStore((s) => s.navPending);

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Navbar locale={locale} />
      <main
        className={cn(
          "flex-1 transition-opacity duration-150",
          navPending && "pointer-events-none opacity-50",
        )}
      >
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
