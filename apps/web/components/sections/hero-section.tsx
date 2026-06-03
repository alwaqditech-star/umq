"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function HeroSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-24 start-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 end-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="container-umq relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-medium text-accent">
            {dict.tagline}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{dict.brandFull}</span>
          </h1>
          <p className="mt-6 text-lg text-foreground-muted sm:text-xl">
            {locale === "ar"
              ? "نبني منصات ومنتجات رقمية بمعايير عالمية — من الاستراتيجية إلى التشغيل."
              : "We build digital platforms and products to global standards — from strategy to operations."}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={localePath(locale, "/contact")}>
              <Button size="lg">
                {dict.cta.getStarted}
                <Arrow className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={localePath(locale, "/services")}>
              <Button variant="secondary" size="lg">
                {dict.cta.learnMore}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
