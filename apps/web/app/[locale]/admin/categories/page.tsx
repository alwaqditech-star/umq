"use client";

import { useCallback, useState } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api/types";
import { AdminFormModal } from "@/components/admin/form-modal";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/use-locale";
import { useAuthStore } from "@/stores/auth-store";

type Tab = "projects" | "blog";

export default function AdminCategoriesPage() {
  const locale = useLocale();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [tab, setTab] = useState<Tab>("projects");
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);

  const apiFor = (t: Tab) =>
    t === "projects" ? api.categories.projects : api.categories.blog;

  const canManage =
    (tab === "projects" && hasPermission("projects:manage")) ||
    (tab === "blog" && hasPermission("blog:manage"));

  const load = useCallback(() => apiFor(tab).list(), [tab]);
  const { items: rows, loading, reload } = useAdminList(load);

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    {
      id: "projects",
      label: locale === "ar" ? "مشاريع" : "Projects",
      show: hasPermission("projects:manage"),
    },
    {
      id: "blog",
      label: locale === "ar" ? "مدونة" : "Blog",
      show: hasPermission("blog:manage"),
    },
  ];

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "التصنيفات" : "Categories"}
        </h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            {locale === "ar" ? "إضافة" : "Add"}
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </Button>
          ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-table-header">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                slug
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                AR
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                EN
              </th>
              {canManage && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-4 py-3">{row.slug}</td>
                <td className="px-4 py-3">{row.nameAr}</td>
                <td className="px-4 py-3">{row.nameEn}</td>
                {canManage && (
                  <td className="px-4 py-3 text-end">
                    <Button
                      size="sm"
                      variant="ghost"
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
                        await apiFor(tab).delete(row.id);
                        await reload();
                      }}
                    >
                      {locale === "ar" ? "حذف" : "Delete"}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminFormModal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing
            ? locale === "ar"
              ? "تعديل تصنيف"
              : "Edit category"
            : locale === "ar"
              ? "تصنيف جديد"
              : "New category"
        }
        locale={locale}
        submitLabel={locale === "ar" ? "حفظ" : "Save"}
        fields={[
          { name: "slug", label: "slug", required: true },
          { name: "nameAr", label: "AR", required: true },
          { name: "nameEn", label: "EN", required: true },
          ...(tab === "projects"
            ? [
                {
                  name: "order",
                  label: locale === "ar" ? "الترتيب" : "Order",
                  type: "number" as const,
                },
              ]
            : []),
        ]}
        initialValues={{
          slug: editing?.slug ?? "",
          nameAr: editing?.nameAr ?? "",
          nameEn: editing?.nameEn ?? "",
          order: String(editing?.order ?? 0),
        }}
        onSubmit={async (values) => {
          const payload = {
            slug: values.slug ?? "",
            nameAr: values.nameAr ?? "",
            nameEn: values.nameEn ?? "",
            order: Number(values.order || 0),
          };
          if (editing) await apiFor(tab).update(editing.id, payload);
          else await apiFor(tab).create(payload);
          await reload();
        }}
      />
    </div>
  );
}
