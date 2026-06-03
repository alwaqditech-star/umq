"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/api/types";
import { EntityTable } from "@/components/admin/entity-table";
import { localized } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminBlogPage() {
  const locale = useLocale();
  const [items, setItems] = useState<BlogPost[]>([]);

  const load = useCallback(async () => {
    setItems(await api.blog.getAll());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <EntityTable
      title={locale === "ar" ? "المدونة" : "Blog CMS"}
      createLabel={locale === "ar" ? "مقال جديد" : "New post"}
      rows={items}
      columns={[
        {
          key: "title",
          header: "Title",
          render: (r) => localized(locale, r, "titleAr", "titleEn"),
        },
        { key: "category", header: "Category", render: (r) => r.category },
        { key: "date", header: "Published", render: (r) => r.publishedAt },
      ]}
      onCreate={async () => {
        await api.blog.create({
          slug: `post-${Date.now()}`,
          titleAr: "مقال جديد",
          titleEn: "New Post",
          excerptAr: "مقتطف",
          excerptEn: "Excerpt",
          category: "General",
          author: "Admin",
          publishedAt: new Date().toISOString().slice(0, 10),
          readingTime: 5,
        });
        await load();
      }}
      onDelete={async (id) => {
        await api.blog.delete(id);
        await load();
      }}
    />
  );
}
