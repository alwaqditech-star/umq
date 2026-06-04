"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import {
  getPostLoginPathForLocale,
  isAdminUser,
  isEditorUser,
} from "@/lib/admin/rbac";

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

  const user = useAuthStore((s) => s.user);

  const sessionVerified = useAuthStore((s) => s.sessionVerified);

  const markSessionVerified = useAuthStore((s) => s.markSessionVerified);

  const [ready, setReady] = useState(() =>
    Boolean(sessionVerified && user && isAdminUser(user)),
  );

  useEffect(() => {
    if (sessionVerified && user && isAdminUser(user)) {
      setReady(true);

      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const current = user ?? (await api.auth.getCurrentUser());

        if (!current) {
          router.replace(localePath(locale, "/login"));

          return;
        }

        if (isEditorUser(current)) {
          router.replace(getPostLoginPathForLocale(current.roleSlug, locale));

          return;
        }

        if (!isAdminUser(current)) {
          useAuthStore.getState().clearSession();

          router.replace(localePath(locale, "/forbidden"));

          return;
        }

        markSessionVerified();

        if (!cancelled) setReady(true);
      } catch {
        router.replace(localePath(locale, "/login"));
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [user, locale, router, sessionVerified, markSessionVerified]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-foreground-muted">
        {locale === "ar" ? "جاري التحقق..." : "Verifying session..."}
      </div>
    );
  }

  return <>{children}</>;
}
