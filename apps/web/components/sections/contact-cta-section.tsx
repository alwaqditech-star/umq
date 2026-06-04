"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MeshBackground } from "@/components/design/mesh-background";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function ContactCtaSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <MeshBackground variant="hero" />
      <div className="container-umq relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="surface-premium mx-auto max-w-3xl rounded-3xl border-gradient p-10 text-center sm:p-14"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="text-gradient">
              {locale === "ar"
                ? "لنبني شيئاً عظيماً"
                : "Let's build something great"}
            </span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            {locale === "ar"
              ? "فريق عُمْق جاهز لمناقشة مشروعك القادم."
              : "The UMQ team is ready to discuss your next initiative."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={localePath(locale, "/contact")}>
              <Button size="lg">
                {dict.cta.contactUs}
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
