"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Service } from "@/lib/api/types";
import { EntityTable } from "@/components/admin/entity-table";
import { localized } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminServicesPage() {
  const locale = useLocale();
  const [items, setItems] = useState<Service[]>([]);

  const load = useCallback(async () => {
    setItems(await api.services.getAll());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <EntityTable
      title={locale === "ar" ? "الخدمات" : "Services"}
      createLabel={locale === "ar" ? "إضافة خدمة" : "Add service"}
      rows={items}
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => localized(locale, r, "titleAr", "titleEn"),
        },
        { key: "slug", header: "Slug", render: (r) => r.slug },
        { key: "icon", header: "Icon", render: (r) => r.icon },
      ]}
      onCreate={async () => {
        await api.services.create({
          slug: `service-${Date.now()}`,
          titleAr: "خدمة جديدة",
          titleEn: "New Service",
          summaryAr: "وصف",
          summaryEn: "Description",
          icon: "layers",
        });
        await load();
      }}
      onDelete={async (id) => {
        await api.services.delete(id);
        await load();
      }}
    />
  );
}
