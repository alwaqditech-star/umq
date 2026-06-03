"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/api/types";
import { EntityTable } from "@/components/admin/entity-table";
import { localized } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminProjectsPage() {
  const locale = useLocale();
  const [items, setItems] = useState<Project[]>([]);

  const load = useCallback(async () => {
    setItems(await api.projects.getAll());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <EntityTable
      title={locale === "ar" ? "المشاريع" : "Projects"}
      createLabel={locale === "ar" ? "إضافة مشروع" : "Add project"}
      rows={items}
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => localized(locale, r, "titleAr", "titleEn"),
        },
        { key: "client", header: "Client", render: (r) => r.clientName },
        { key: "category", header: "Category", render: (r) => r.category },
      ]}
      onCreate={async () => {
        await api.projects.create({
          slug: `project-${Date.now()}`,
          titleAr: "مشروع جديد",
          titleEn: "New Project",
          summaryAr: "ملخص",
          summaryEn: "Summary",
          clientName: "Client",
          technologies: ["Next.js"],
          category: "General",
        });
        await load();
      }}
      onDelete={async (id) => {
        await api.projects.delete(id);
        await load();
      }}
    />
  );
}
