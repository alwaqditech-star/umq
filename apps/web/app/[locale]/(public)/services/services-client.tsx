"use client";

import { Layers } from "lucide-react";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { FadeUp } from "@/components/motion/fade-up";
import { Card } from "@/components/ui/card";
import type { Service } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { serviceIconMap } from "@/lib/icons";
import type { Locale } from "@/stores/ui-store";

export function ServicesPageClient({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  return (
    <div className="container-umq py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold text-foreground">
          {locale === "ar" ? "خدماتنا" : "Services"}
        </h1>
        <p className="mt-4 max-w-2xl text-foreground-muted">
          {locale === "ar"
            ? "مجموعة خدمات تقنية شاملة لدعم نمو أعمالك."
            : "A comprehensive suite of technology services to support your growth."}
        </p>
      </FadeUp>
      <StaggerList className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = serviceIconMap[service.icon] ?? Layers;
          return (
            <StaggerItem key={service.id}>
              <Card hover className="h-full">
                <div className="mb-4 inline-flex rounded-xl bg-accent/15 p-3 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">
                  {localized(locale, service, "titleAr", "titleEn")}
                </h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  {localized(locale, service, "summaryAr", "summaryEn")}
                </p>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>
    </div>
  );
}
