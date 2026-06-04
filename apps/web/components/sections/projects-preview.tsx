"use client";

import Link from "next/link";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { FadeUp } from "@/components/motion/fade-up";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/api/types";
import { localized, getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function ProjectsPreview({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const dict = getDictionary(locale);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="section-alt border-y border-border/50 py-20 sm:py-24">
      <div className="container-umq">
        <FadeUp className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="section-kicker">
              {locale === "ar" ? "أعمالنا" : "Portfolio"}
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              {dict.sections.projects}
            </h2>
            <p className="mt-2 text-foreground-muted">
              {locale === "ar" ? "أعمال نفخر بها." : "Work we're proud of."}
            </p>
          </div>
          <Link href={localePath(locale, "/projects")}>
            <Button variant="ghost">{dict.cta.viewAll}</Button>
          </Link>
        </FadeUp>
        <StaggerList className="mt-10 grid gap-6 lg:grid-cols-3">
          {featured.map((project) => (
            <StaggerItem key={project.id}>
              <Card hover elevated className="h-full">
                <Badge variant="accent">{project.category}</Badge>
                <h3 className="mt-4 text-xl font-semibold">
                  {localized(locale, project, "titleAr", "titleEn")}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted">
                  {localized(locale, project, "summaryAr", "summaryEn")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((t) => (
                    <Badge key={t} variant="default">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
