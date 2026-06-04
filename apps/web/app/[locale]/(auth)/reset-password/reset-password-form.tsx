"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useLocale } from "@/lib/i18n/use-locale";

export function ResetPasswordForm() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    if (newPassword !== confirm) {
      setError(
        locale === "ar"
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match",
      );
      setLoading(false);
      return;
    }
    if (!token) {
      setError(
        locale === "ar" ? "رابط غير صالح" : "Invalid or missing reset link",
      );
      setLoading(false);
      return;
    }
    try {
      const result = await api.auth.resetPassword(token, newPassword);
      setMessage(result.message);
      setTimeout(() => router.push(localePath(locale, "/login")), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : locale === "ar"
            ? "تعذر إعادة التعيين"
            : "Reset failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">
        {locale === "ar" ? "إعادة تعيين كلمة المرور" : "Reset password"}
      </h1>
      <p className="mt-2 text-center text-sm text-foreground-muted">
        {locale === "ar"
          ? "اختر كلمة مرور قوية (8+ أحرف، أحرف كبيرة وصغيرة ورقم)"
          : "Choose a strong password (8+ chars, upper, lower, number)"}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          name="password"
          type="password"
          label={dict.auth.password}
          autoComplete="new-password"
          required
          minLength={8}
        />
        <Input
          name="confirm"
          type="password"
          label={locale === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}
          autoComplete="new-password"
          required
          minLength={8}
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
          {locale === "ar" ? "حفظ كلمة المرور" : "Save new password"}
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
