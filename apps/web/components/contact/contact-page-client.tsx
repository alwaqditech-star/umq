"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  MessageCircle,
} from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { FadeUp } from "@/components/motion/fade-up";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";
import { useSiteConfig } from "@/providers/site-config-provider";
import { apiFetch } from "@/lib/api";
import { localePath } from "@/lib/i18n/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ContactPageClient({
  faqItems = [],
}: {
  faqItems?: { q: string; a: string }[];
}) {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const { contact: settings } = useSiteConfig();
  const c = dict.contact;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const contactChannels = [
    { key: "email" as const, icon: Mail, value: settings.email, label: c.email.label },
    { key: "phone" as const, icon: Phone, value: settings.phone, label: c.phone.label },
    {
      key: "address" as const,
      icon: MapPin,
      value: locale === "ar" ? settings.addressAr : settings.addressEn,
      label: c.address.label,
    },
    {
      key: "hours" as const,
      icon: Clock,
      value: locale === "ar" ? settings.hoursAr : settings.hoursEn,
      label: c.hours.label,
    },
  ] as const;

  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
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
      setSent(true);
    } catch {
      setError(c.errorSend);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        kicker={c.kicker}
        title={c.title}
        description={c.subtitle}
        centered
      />

      <div className="container-umq py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <FadeUp className="lg:col-span-5">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              {c.channelsTitle}
            </p>
            <p className="mt-2 text-foreground-muted">{c.channelsSubtitle}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactChannels.map(({ key, icon: Icon, value, label }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: locale === "ar" ? 16 : -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <Card
                    padding="md"
                    className="card-elevated group h-full border-border/80 transition-colors hover:border-accent/35"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                          {label}
                        </p>
                        <p className="mt-1 font-medium text-foreground break-words">
                          {value}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card
              padding="lg"
              className="card-elevated mt-8 overflow-hidden border-border/80"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">{c.responseTitle}</p>
                  <p className="mt-2 text-sm text-foreground-muted">
                    {c.responseBody}
                  </p>
                </div>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/15 px-4 py-3 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/25"
              >
                <MessageCircle className="h-5 w-5" />
                {locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
              </a>
              {settings.mapEmbedUrl ? (
                <iframe
                  title={c.mapCaption}
                  src={settings.mapEmbedUrl}
                  className="mt-4 h-48 w-full rounded-xl border border-border/80"
                  loading="lazy"
                />
              ) : (
                <div
                  className="mt-4 flex h-36 items-center justify-center rounded-xl border border-dashed border-accent/25 bg-accent/5 text-sm text-foreground-muted"
                >
                  {c.mapCaption}
                </div>
              )}
            </Card>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-7">
            <Card
              padding="lg"
              className={cn(
                "card-elevated relative overflow-hidden border-border/80",
                "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-primary before:via-accent before:to-secondary",
              )}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent"
                    >
                      <CheckCircle2 className="h-10 w-10" />
                    </motion.div>
                    <h2 className="mt-6 text-2xl font-bold text-foreground">
                      {c.successTitle}
                    </h2>
                    <p className="mt-3 max-w-md text-foreground-muted">
                      {c.successMessage}
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-8"
                      onClick={() => setSent(false)}
                    >
                      {c.sendAnother}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      {c.formTitle}
                    </h2>
                    <p className="mt-2 text-sm text-foreground-muted">
                      {c.formSubtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input name="name" label={c.name} required />
                        <Input
                          name="email"
                          label={c.emailLabel}
                          type="email"
                          required
                        />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input name="phone" label={c.phoneLabel} type="tel" />
                        <Input name="subject" label={c.subject} required />
                      </div>
                      <Textarea name="message" label={c.message} required />
                      {error && (
                        <p className="text-sm text-red-600" role="alert">
                          {error}
                        </p>
                      )}
                      <Button type="submit" loading={loading} fullWidth size="lg">
                        <Send className="h-4 w-4" />
                        {c.submit}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </FadeUp>
        </div>

        {faqItems.length > 0 && (
          <FadeUp className="mt-20">
            <h2 className="text-2xl font-bold">
              {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
            </h2>
            <div className="mt-6 space-y-3">
              {faqItems.map((item, i) => (
                <Card key={item.q} padding="md" className="overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 text-start"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-medium">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform",
                        openFaq === i && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 text-sm text-foreground-muted"
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </FadeUp>
        )}

        <FadeUp className="mt-16 text-center">
          <Card padding="lg" className="border-gradient mx-auto max-w-2xl">
            <p className="text-lg font-semibold">
              {locale === "ar" ? "جاهز للبدء؟" : "Ready to start?"}
            </p>
            <Link href={localePath(locale, "/services")} className="mt-4 inline-block">
              <Button variant="secondary">
                {dict.cta.learnMore}
              </Button>
            </Link>
          </Card>
        </FadeUp>
      </div>
    </>
  );
}
