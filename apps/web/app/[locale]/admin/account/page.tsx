"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { AuthSession } from "@/lib/api/interfaces/auth.service";
import { localePath } from "@/lib/i18n/routes";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminAccountPage() {
  const locale = useLocale();
  const router = useRouter();
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      setSessions(await api.auth.listSessions());
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLoading(true);
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const currentPassword = String(form.get("currentPassword"));
    const newPassword = String(form.get("newPassword"));
    const confirm = String(form.get("confirm"));
    if (newPassword !== confirm) {
      setError(
        locale === "ar"
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match",
      );
      setPwLoading(false);
      return;
    }
    try {
      const result = await api.auth.changePassword(
        currentPassword,
        newPassword,
      );
      setMessage(result.message);
      setTimeout(() => router.push(localePath(locale, "/login")), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "الحساب والأمان" : "Account & security"}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {locale === "ar"
            ? "تغيير كلمة المرور وإدارة الجلسات النشطة"
            : "Change password and manage active sessions"}
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">
          {locale === "ar" ? "تغيير كلمة المرور" : "Change password"}
        </h2>
        <form
          onSubmit={handleChangePassword}
          className="mt-4 max-w-md space-y-4"
        >
          <Input
            name="currentPassword"
            type="password"
            label={locale === "ar" ? "كلمة المرور الحالية" : "Current password"}
            required
          />
          <Input
            name="newPassword"
            type="password"
            label={locale === "ar" ? "كلمة المرور الجديدة" : "New password"}
            required
            minLength={8}
          />
          <Input
            name="confirm"
            type="password"
            label={locale === "ar" ? "تأكيد" : "Confirm"}
            required
            minLength={8}
          />
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={pwLoading}>
            {locale === "ar" ? "تحديث" : "Update password"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {locale === "ar" ? "الجلسات النشطة" : "Active sessions"}
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={async () => {
              await api.auth.revokeOtherSessions();
              await loadSessions();
            }}
          >
            {locale === "ar"
              ? "إنهاء الجلسات الأخرى"
              : "Sign out other devices"}
          </Button>
        </div>
        {loadingSessions ? (
          <p className="mt-4 text-sm text-foreground-muted">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {s.userAgent ??
                      (locale === "ar" ? "غير معروف" : "Unknown device")}
                    {s.current && (
                      <span className="ms-2 rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">
                        {locale === "ar" ? "الحالية" : "Current"}
                      </span>
                    )}
                  </p>
                  <p className="text-foreground-muted">
                    {s.ipAddress ?? "—"} ·{" "}
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                {!s.current && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      await api.auth.revokeSession(s.id);
                      await loadSessions();
                    }}
                  >
                    {locale === "ar" ? "إنهاء" : "Revoke"}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
