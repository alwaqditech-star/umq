"use client";

import { useState } from "react";
import { FadeUp } from "@/components/motion/fade-up";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/use-locale";

export default function ContactPage() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
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
              ? "تم إرسال رسالتك (وضع تجريبي)."
              : "Message sent (mock mode)."}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={locale === "ar" ? "الاسم" : "Name"} required />
            <Input
              label={locale === "ar" ? "البريد" : "Email"}
              type="email"
              required
            />
            <Input label={locale === "ar" ? "الموضوع" : "Subject"} required />
            <div>
              <label className="text-sm font-medium">
                {locale === "ar" ? "الرسالة" : "Message"}
              </label>
              <textarea
                className="mt-1.5 min-h-[120px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>
            <Button type="submit" loading={loading} fullWidth>
              {locale === "ar" ? "إرسال" : "Send"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
