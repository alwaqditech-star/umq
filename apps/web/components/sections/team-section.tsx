"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function TeamSection({
  locale,
  members,
}: {
  locale: Locale;
  members: {
    id: string;
    nameAr: string;
    nameEn: string;
    roleAr: string;
    roleEn: string;
    bioAr: string;
    bioEn: string;
  }[];
}) {
  if (members.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="container-umq">
        <FadeUp className="text-center">
          <span className="section-kicker">
            {locale === "ar" ? "فريقنا" : "Team"}
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            {locale === "ar" ? "خبراء عُمْق" : "The UMQ team"}
          </h2>
        </FadeUp>
        <StaggerList className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <StaggerItem key={m.id}>
              <Card elevated className="h-full text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-light">
                  {localized(locale, m, "nameAr", "nameEn").charAt(0)}
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {localized(locale, m, "nameAr", "nameEn")}
                </h3>
                <p className="text-sm font-medium text-accent">
                  {localized(locale, m, "roleAr", "roleEn")}
                </p>
                <p className="mt-3 text-sm text-foreground-muted line-clamp-3">
                  {localized(locale, m, "bioAr", "bioEn")}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
