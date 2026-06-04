"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { localePath } from "@/lib/i18n/routes";
import { useAuthStore } from "@/stores/auth-store";
import type { Locale } from "@/stores/ui-store";

export function AdminAuthGate({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!accessToken) {
        router.replace(localePath(locale, "/login"));
        return;
      }

      try {
        const user = await api.auth.getCurrentUser();
        if (!user) {
          router.replace(localePath(locale, "/login"));
          return;
        }
        if (!cancelled) setReady(true);
      } catch {
        router.replace(localePath(locale, "/login"));
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [accessToken, locale, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-foreground-muted">
        {locale === "ar" ? "جاري التحقق..." : "Verifying session..."}
      </div>
    );
  }

  return <>{children}</>;
}
