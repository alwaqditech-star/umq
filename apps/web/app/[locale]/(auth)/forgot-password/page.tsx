"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useLocale } from "@/lib/i18n/use-locale";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    try {
      const result = await api.auth.forgotPassword(String(form.get("email")));
      setMessage(
        result.resetUrl
          ? `${result.message}\n\n${locale === "ar" ? "رابط التطوير:" : "Dev link:"} ${result.resetUrl}`
          : result.message,
      );
    } catch {
      setError(dict.auth.requestFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">
        {dict.auth.forgotTitle}
      </h1>
      <p className="mt-2 text-center text-sm text-foreground-muted">
        {dict.auth.forgotSubtitle}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          name="email"
          type="email"
          label={dict.auth.email}
          autoComplete="email"
          required
        />
        {message && (
          <p
            className="text-sm text-green-700 dark:text-green-400"
            role="status"
          >
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} fullWidth>
          {dict.auth.sendResetLink}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link
          href={localePath(locale, "/login")}
          className="text-accent hover:underline"
        >
          {dict.auth.backToLogin}
        </Link>
      </p>
    </div>
  );
}
