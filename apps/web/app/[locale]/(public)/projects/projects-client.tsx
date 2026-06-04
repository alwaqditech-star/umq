"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/public/page-header";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function ProjectsPageClient({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const p = getDictionary(locale).pages;
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(projects.map((pr) => pr.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filtered =
    category === "all"
      ? projects
      : projects.filter((pr) => pr.category === category);

  return (
    <>
      <PageHeader
        kicker={p.projectsKicker}
        title={p.projectsTitle}
        description={p.projectsDesc}
      />
      <div className="container-umq py-14 sm:py-20">
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "primary" : "secondary"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat === "all" ? (locale === "ar" ? "الكل" : "All") : cat}
            </Button>
          ))}
        </div>

        <StaggerList className="grid gap-8 sm:grid-cols-2">
          {filtered.map((project) => (
            <StaggerItem key={project.id}>
              <Card hover elevated className="group h-full overflow-hidden p-0">
                <Link href={localePath(locale, `/projects/${project.slug}`)}>
                  <div
                    className={cn(
                      "relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/15",
                    )}
                  >
                    {project.coverImageUrl ? (
                      <Image
                        src={project.coverImageUrl}
                        alt={localized(locale, project, "titleAr", "titleEn")}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, 50vw"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/10" />
                  </div>
                  <div className="p-6">
                    <Badge variant="accent">{project.category}</Badge>
                    <h2 className="mt-3 text-2xl font-semibold transition-colors group-hover:text-accent">
                      {localized(locale, project, "titleAr", "titleEn")}
                    </h2>
                    <p className="mt-2 text-foreground-muted line-clamp-2">
                      {localized(locale, project, "summaryAr", "summaryEn")}
                    </p>
                    <p className="mt-4 text-sm text-foreground-muted">
                      {project.clientName}
                    </p>
                  </div>
                </Link>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </>
  );
}
