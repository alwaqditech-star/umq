"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function ProjectsPageClient({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  return (
    <div className="container-umq py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold">
          {locale === "ar" ? "مشاريعنا" : "Projects"}
        </h1>
      </FadeUp>
      <StaggerList className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.id}>
            <Card hover>
              <Badge variant="accent">{project.category}</Badge>
              <h2 className="mt-4 text-2xl font-semibold">
                {localized(locale, project, "titleAr", "titleEn")}
              </h2>
              <p className="mt-2 text-foreground-muted">
                {localized(locale, project, "summaryAr", "summaryEn")}
              </p>
              <p className="mt-4 text-sm text-foreground-muted">
                {project.clientName}
              </p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
