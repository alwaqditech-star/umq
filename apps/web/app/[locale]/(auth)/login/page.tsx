"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useLocale } from "@/lib/i18n/use-locale";

export default function LoginPage() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await api.auth.login({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      router.push(localePath(locale, "/admin"));
    } catch {
      setError(
        locale === "ar"
          ? "بيانات الدخول غير صحيحة (جرب admin@umq.sa)"
          : "Invalid credentials (try admin@umq.sa)",
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
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          name="email"
          type="email"
          label={dict.auth.email}
          defaultValue="admin@umq.sa"
          required
        />
        <Input
          name="password"
          type="password"
          label={dict.auth.password}
          defaultValue="ChangeMe123!"
          required
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} fullWidth>
          {dict.auth.submit}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
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
