"use client";

import { useCallback, useState } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/api/types";
import {
  AdminFormModal,
  contentStatusOptions,
} from "@/components/admin/form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localized } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";
import { useAuthStore } from "@/stores/auth-store";

const projectFields = (locale: "ar" | "en") => [
  { name: "slug", label: "Slug", required: true },
  {
    name: "titleAr",
    label: locale === "ar" ? "العنوان (عربي)" : "Title (AR)",
    required: true,
  },
  {
    name: "titleEn",
    label: locale === "ar" ? "العنوان (إنجليزي)" : "Title (EN)",
    required: true,
  },
  { name: "summaryAr", label: "Summary AR", type: "textarea" as const },
  { name: "summaryEn", label: "Summary EN", type: "textarea" as const },
  {
    name: "contentAr",
    label: "Content AR",
    type: "textarea" as const,
    rows: 4,
  },
  {
    name: "contentEn",
    label: "Content EN",
    type: "textarea" as const,
    rows: 4,
  },
  { name: "clientName", label: locale === "ar" ? "العميل" : "Client" },
  {
    name: "technologies",
    label:
      locale === "ar"
        ? "التقنيات (مفصولة بفاصلة)"
        : "Technologies (comma-separated)",
  },
  {
    name: "categorySlug",
    label: locale === "ar" ? "تصنيف (slug)" : "Category slug",
    placeholder: "enterprise",
  },
  {
    name: "order",
    label: locale === "ar" ? "الترتيب" : "Order",
    type: "number" as const,
  },
  {
    name: "status",
    label: locale === "ar" ? "الحالة" : "Status",
    type: "select" as const,
    options: contentStatusOptions(locale),
  },
  {
    name: "featured",
    label: locale === "ar" ? "مميز" : "Featured",
    type: "checkbox" as const,
  },
];

function toPayload(values: Record<string, string>) {
  return {
    slug: values.slug,
    titleAr: values.titleAr,
    titleEn: values.titleEn,
    summaryAr: values.summaryAr,
    summaryEn: values.summaryEn,
    contentAr: values.contentAr,
    contentEn: values.contentEn,
    clientName: values.clientName,
    technologies: values.technologies,
    categorySlug: values.categorySlug || undefined,
    order: Number(values.order || 0),
    status: values.status || "draft",
    featured: values.featured === "true",
  };
}

export default function AdminProjectsPage() {
  const locale = useLocale();
  const canManage = useAuthStore((s) => s.hasPermission("projects:manage"));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const load = useCallback(
    () => api.projects.listAdmin?.() ?? api.projects.getAll(),
    [],
  );
  const { items, loading, reload } = useAdminList(load);

  const initial = editing
    ? {
        ...editing,
        technologies: editing.technologies.join(", "),
        categorySlug: "",
        order: String(editing.order ?? 0),
        status: editing.status ?? "draft",
        featured: editing.featured ? "true" : "false",
      }
    : {
        status: "published",
        featured: "false",
        order: "0",
        categorySlug: "enterprise",
      };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          {locale === "ar" ? "المشاريع" : "Projects"}
        </h2>
        {canManage && (
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {locale === "ar" ? "إضافة مشروع" : "Add project"}
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {localized(locale, row, "titleAr", "titleEn")}
              </TableCell>
              <TableCell>{row.clientName}</TableCell>
              <TableCell>
                <Badge>{row.status}</Badge>
              </TableCell>
              {canManage && (
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg p-2 hover:bg-accent/10"
                      onClick={() => {
                        setEditing(row);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                      onClick={async () => {
                        await api.projects.delete(row.id);
                        await reload();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AdminFormModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit project" : "Add project"}
        fields={projectFields(locale)}
        initialValues={initial as Record<string, string>}
        locale={locale}
        submitLabel="Save"
        onSubmit={async (values) => {
          const payload = toPayload(values);
          if (editing) await api.projects.update(editing.id, payload);
          else await api.projects.create(payload);
          await reload();
        }}
      />
    </div>
  );
}
