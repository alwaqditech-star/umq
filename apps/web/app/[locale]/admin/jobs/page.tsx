"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Application, Job } from "@/lib/api/types";
import { EntityTable } from "@/components/admin/entity-table";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { localized } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminJobsPage() {
  const locale = useLocale();
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const load = useCallback(async () => {
    const [j, a] = await Promise.all([
      api.jobs.getAll(),
      api.jobs.getApplications(),
    ]);
    setJobs(j);
    setApplications(a);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <Tabs
        className="mb-6"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "jobs", label: locale === "ar" ? "الوظائف" : "Jobs" },
          {
            id: "applications",
            label: locale === "ar" ? "الطلبات" : "Applications",
          },
        ]}
      />
      {tab === "jobs" ? (
        <EntityTable
          title={locale === "ar" ? "إدارة الوظائف" : "Job management"}
          createLabel={locale === "ar" ? "وظيفة جديدة" : "New job"}
          rows={jobs}
          columns={[
            {
              key: "title",
              header: "Title",
              render: (r) => localized(locale, r, "titleAr", "titleEn"),
            },
            { key: "dept", header: "Dept", render: (r) => r.department },
            { key: "loc", header: "Location", render: (r) => r.location },
          ]}
          onCreate={async () => {
            await api.jobs.create({
              slug: `job-${Date.now()}`,
              titleAr: "وظيفة جديدة",
              titleEn: "New Role",
              department: "Engineering",
              location: "Riyadh",
              type: "Full-time",
              descriptionAr: "وصف",
              descriptionEn: "Description",
            });
            await load();
          }}
          onDelete={async (id) => {
            await api.jobs.delete(id);
            await load();
          }}
        />
      ) : (
        <EntityTable
          title={locale === "ar" ? "طلبات التوظيف" : "Applications"}
          createLabel=""
          rows={applications}
          columns={[
            { key: "name", header: "Name", render: (r) => r.applicantName },
            { key: "email", header: "Email", render: (r) => r.email },
            {
              key: "status",
              header: "Status",
              render: (r) => <Badge variant="accent">{r.status}</Badge>,
            },
          ]}
        />
      )}
    </div>
  );
}
