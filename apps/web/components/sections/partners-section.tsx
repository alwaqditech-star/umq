"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function PartnersSection({
  locale,
  partners,
}: {
  locale: Locale;
  partners: { id: string; nameAr: string; nameEn: string; url: string }[];
}) {
  if (partners.length === 0) return null;

  return (
    <section className="section-alt border-y border-border/40 py-16 sm:py-20">
      <div className="container-umq">
        <FadeUp className="text-center">
          <span className="section-kicker">
            {locale === "ar" ? "شركاؤنا" : "Partners"}
          </span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            {locale === "ar" ? "يثقون بنا" : "Trusted by"}
          </h2>
        </FadeUp>
        <StaggerList className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {partners.map((p) => (
            <StaggerItem key={p.id}>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-premium rounded-2xl px-8 py-4 text-sm font-semibold text-foreground-muted transition-all hover:border-accent/40 hover:text-accent"
                >
                  {localized(locale, p, "nameAr", "nameEn")}
                </a>
              ) : (
                <span className="surface-premium rounded-2xl px-8 py-4 text-sm font-semibold text-foreground-muted">
                  {localized(locale, p, "nameAr", "nameEn")}
                </span>
              )}
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
