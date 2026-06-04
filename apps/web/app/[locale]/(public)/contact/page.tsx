"use client";

import { useState } from "react";
import { FadeUp } from "@/components/motion/fade-up";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/use-locale";
import { apiFetch } from "@/lib/api";
import { apiMode } from "@/lib/api";

export default function ContactPage() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      if (apiMode === "http") {
        await apiFetch("/contacts", {
          method: "POST",
          body: JSON.stringify({
            name: String(form.get("name")),
            email: String(form.get("email")),
            phone: String(form.get("phone") ?? ""),
            subject: String(form.get("subject")),
            message: String(form.get("message")),
          }),
        });
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setSent(true);
    } catch {
      setError(
        locale === "ar"
          ? "تعذر إرسال الرسالة. حاول مرة أخرى."
          : "Could not send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-umq max-w-3xl py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold">
          {locale === "ar" ? "تواصل معنا" : "Contact Us"}
        </h1>
        <p className="mt-4 text-foreground-muted">
          {locale === "ar"
            ? "أخبرنا عن مشروعك وسيتواصل معك فريقنا قريباً."
            : "Tell us about your project and our team will reach out soon."}
        </p>
      </FadeUp>
      <Card className="mt-10">
        {sent ? (
          <p className="text-center text-accent font-medium">
            {locale === "ar"
              ? "تم إرسال رسالتك بنجاح."
              : "Your message was sent successfully."}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              label={locale === "ar" ? "الاسم" : "Name"}
              required
            />
            <Input
              name="email"
              label={locale === "ar" ? "البريد" : "Email"}
              type="email"
              required
            />
            <Input
              name="subject"
              label={locale === "ar" ? "الموضوع" : "Subject"}
              required
            />
            <div>
              <label className="text-sm font-medium">
                {locale === "ar" ? "الرسالة" : "Message"}
              </label>
              <textarea
                name="message"
                className="mt-1.5 min-h-[120px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" loading={loading} fullWidth>
              {locale === "ar" ? "إرسال" : "Send"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
