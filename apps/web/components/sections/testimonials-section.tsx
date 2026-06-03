"use client";

import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { FadeUp } from "@/components/motion/fade-up";
import { Card } from "@/components/ui/card";
import type { Testimonial } from "@/lib/api/types";
import { localized, getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";
import { Star } from "lucide-react";

export function TestimonialsSection({
  locale,
  testimonials,
}: {
  locale: Locale;
  testimonials: Testimonial[];
}) {
  const dict = getDictionary(locale);

  return (
    <section className="py-20">
      <div className="container-umq">
        <FadeUp className="text-center">
          <h2 className="text-3xl font-bold">{dict.sections.testimonials}</h2>
        </FadeUp>
        <StaggerList className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="h-full">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-foreground-muted">
                  &ldquo;{localized(locale, item, "contentAr", "contentEn")}&rdquo;
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold">
                    {localized(locale, item, "authorAr", "authorEn")}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    {localized(locale, item, "companyAr", "companyEn")}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
