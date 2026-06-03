"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { FadeUp } from "@/components/motion/fade-up";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/api/types";
import { localized, getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { serviceIconMap } from "@/lib/icons";
import type { Locale } from "@/stores/ui-store";

export function ServicesPreview({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const dict = getDictionary(locale);
  const featured = services.filter((s) => s.featured).slice(0, 3);

  return (
    <section className="py-20">
      <div className="container-umq">
        <FadeUp className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {dict.sections.services}
            </h2>
            <p className="mt-2 max-w-xl text-foreground-muted">
              {locale === "ar"
                ? "حلول تقنية متكاملة لتحولك الرقمي."
                : "Integrated technology solutions for your digital journey."}
            </p>
          </div>
          <Link href={localePath(locale, "/services")}>
            <Button variant="ghost">{dict.cta.viewAll}</Button>
          </Link>
        </FadeUp>
        <StaggerList className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => {
            const Icon = serviceIconMap[service.icon] ?? Layers;
            return (
              <StaggerItem key={service.id}>
                <Card hover className="h-full">
                  <div className="mb-4 inline-flex rounded-xl bg-accent/15 p-3 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {localized(locale, service, "titleAr", "titleEn")}
                  </h3>
                  <p className="mt-2 text-sm text-foreground-muted">
                    {localized(locale, service, "summaryAr", "summaryEn")}
                  </p>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </section>
  );
}
