"use client";

import { useCallback, useState } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { api } from "@/lib/api";
import type { Testimonial } from "@/lib/api/types";
import { AdminFormModal } from "@/components/admin/form-modal";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminTestimonialsPage() {
  const locale = useLocale();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => api.cms.testimonials.listAdmin!(), []);
  const { items: rows, loading, reload } = useAdminList(load);

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "آراء العملاء" : "Testimonials"}
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          {locale === "ar" ? "إضافة" : "Add"}
        </Button>
      </div>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border p-4"
          >
            <div>
              <p className="font-medium">{row.authorAr}</p>
              <p className="text-sm text-foreground-muted line-clamp-2">
                {row.contentAr}
              </p>
              <p className="mt-1 text-xs">{row.status}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditing(row);
                  setOpen(true);
                }}
              >
                {locale === "ar" ? "تعديل" : "Edit"}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  await api.cms.testimonials.delete(row.id);
                  await reload();
                }}
              >
                {locale === "ar" ? "حذف" : "Delete"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <AdminFormModal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing
            ? locale === "ar"
              ? "تعديل"
              : "Edit"
            : locale === "ar"
              ? "جديد"
              : "New"
        }
        locale={locale}
        submitLabel={locale === "ar" ? "حفظ" : "Save"}
        fields={[
          { name: "authorAr", label: "Author AR", required: true },
          { name: "authorEn", label: "Author EN", required: true },
          { name: "companyAr", label: "Company AR" },
          { name: "companyEn", label: "Company EN" },
          {
            name: "contentAr",
            label: "Content AR",
            type: "textarea",
            required: true,
          },
          {
            name: "contentEn",
            label: "Content EN",
            type: "textarea",
            required: true,
          },
          {
            name: "status",
            label: "status",
            type: "select",
            options: [
              { value: "published", label: "published" },
              { value: "draft", label: "draft" },
            ],
          },
        ]}
        initialValues={{
          authorAr: editing?.authorAr ?? "",
          authorEn: editing?.authorEn ?? "",
          companyAr: editing?.companyAr ?? "",
          companyEn: editing?.companyEn ?? "",
          contentAr: editing?.contentAr ?? "",
          contentEn: editing?.contentEn ?? "",
          status: editing?.status ?? "published",
        }}
        onSubmit={async (values) => {
          const payload = {
            authorAr: values.authorAr,
            authorEn: values.authorEn,
            companyAr: values.companyAr,
            companyEn: values.companyEn,
            contentAr: values.contentAr,
            contentEn: values.contentEn,
            rating: 5,
            status: values.status,
          };
          if (editing) await api.cms.testimonials.update(editing.id, payload);
          else await api.cms.testimonials.create(payload);
          await reload();
        }}
      />
    </div>
  );
}
