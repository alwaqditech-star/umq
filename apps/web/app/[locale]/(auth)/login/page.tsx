"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { canSignIn, getPostLoginPathForLocale } from "@/lib/admin/rbac";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useLocale } from "@/lib/i18n/use-locale";

export default function LoginPage() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const user = await api.auth.login({
        email: String(form.get("email")),
        password: String(form.get("password")),
        rememberMe: form.get("rememberMe") === "on",
      });
      if (!canSignIn(user.permissions, user.roleSlug)) {
        await api.auth.logout();
        setError(
          locale === "ar"
            ? "هذا الحساب غير مصرح للدخول"
            : "This account is not authorized to sign in",
        );
        return;
      }
      router.push(getPostLoginPathForLocale(user.roleSlug, locale));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Cannot reach API")) {
        setError(locale === "ar" ? "الخادم غير متاح. شغّل API: pnpm dev" : msg);
        return;
      }
      if (err instanceof ApiError && err.status === 404) {
        setError(
          locale === "ar"
            ? "مسار API غير صحيح. شغّل `npm run dev` من جذر المشروع"
            : "API route not found. Run `npm run dev` from the repo root",
        );
        return;
      }
      setError(
        locale === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{dict.auth.loginTitle}</h1>
      <p className="mt-2 text-center text-sm text-foreground-muted">
        {dict.auth.loginSubtitle}
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
        autoComplete="off"
      >
        <Input
          name="email"
          type="email"
          label={dict.auth.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          readOnly
          onFocus={(e) => e.currentTarget.removeAttribute("readonly")}
          required
        />
        <Input
          name="password"
          type="password"
          label={dict.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          readOnly
          onFocus={(e) => e.currentTarget.removeAttribute("readonly")}
          required
        />
        <label className="flex items-center gap-2 text-sm text-foreground-muted">
          <input
            type="checkbox"
            name="rememberMe"
            className="size-4 rounded border-border"
          />
          {locale === "ar" ? "تذكرني (30 يوماً)" : "Remember me (30 days)"}
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} fullWidth>
          {dict.auth.submit}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link
          href={localePath(locale, "/forgot-password")}
          className="text-accent hover:underline"
        >
          {dict.auth.forgotTitle}
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-foreground-muted">
        {locale === "ar"
          ? "حسابات تجريبية: admin@ / operations@ / editor@umq.sa"
          : "Demo: admin@ / operations@ / editor@umq.sa"}
      </p>
      <p className="mt-4 text-center text-sm">
        <Link
          href={localePath(locale, "")}
          className="text-accent hover:underline"
        >
          {dict.nav.home}
        </Link>
      </p>
    </div>
  );
}
