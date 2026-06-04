"use client";

import { Layers } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import type { Service } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { serviceIconMap } from "@/lib/icons";
import type { Locale } from "@/stores/ui-store";

export function ServicesPageClient({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const p = getDictionary(locale).pages;

  return (
    <>
      <PageHeader
        kicker={p.servicesKicker}
        title={p.servicesTitle}
        description={p.servicesDesc}
      />
      <div className="container-umq py-14 sm:py-20">
        <StaggerList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIconMap[service.icon] ?? Layers;
            return (
              <StaggerItem key={service.id}>
                <Card hover elevated className="h-full">
                  <div className="mb-4 inline-flex rounded-xl border border-accent/20 bg-accent/15 p-3 text-accent">
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
    </>
  );
}
