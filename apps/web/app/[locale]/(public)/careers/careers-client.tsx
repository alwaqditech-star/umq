"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function CareersPageClient({
  locale,
  jobs,
}: {
  locale: Locale;
  jobs: Job[];
}) {
  return (
    <div className="container-umq py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold">
          {locale === "ar" ? "الوظائف" : "Careers"}
        </h1>
        <p className="mt-4 text-foreground-muted">
          {locale === "ar"
            ? "انضم إلى فريق يبني مستقبل التقنية في السعودية."
            : "Join a team building the future of technology in Saudi Arabia."}
        </p>
      </FadeUp>
      <StaggerList className="mt-12 space-y-4">
        {jobs.map((job) => (
          <StaggerItem key={job.id}>
            <Card hover className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {localized(locale, job, "titleAr", "titleEn")}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="accent">{job.department}</Badge>
                  <Badge>{job.location}</Badge>
                  <Badge>{job.type}</Badge>
                </div>
              </div>
              <Button>{locale === "ar" ? "قدّم الآن" : "Apply now"}</Button>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
