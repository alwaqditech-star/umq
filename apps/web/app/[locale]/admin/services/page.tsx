"use client";

import { useCallback, useState } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Service } from "@/lib/api/types";
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

const serviceFields = (locale: "ar" | "en") => [
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
  {
    name: "summaryAr",
    label: locale === "ar" ? "ملخص عربي" : "Summary AR",
    type: "textarea" as const,
  },
  {
    name: "summaryEn",
    label: locale === "ar" ? "ملخص إنجليزي" : "Summary EN",
    type: "textarea" as const,
  },
  {
    name: "contentAr",
    label: locale === "ar" ? "المحتوى عربي" : "Content AR",
    type: "textarea" as const,
    rows: 5,
  },
  {
    name: "contentEn",
    label: locale === "ar" ? "المحتوى إنجليزي" : "Content EN",
    type: "textarea" as const,
    rows: 5,
  },
  { name: "icon", label: locale === "ar" ? "أيقونة" : "Icon" },
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
    icon: values.icon || "layers",
    order: Number(values.order || 0),
    status: values.status || "draft",
    featured: values.featured === "true",
  };
}

export default function AdminServicesPage() {
  const locale = useLocale();
  const canManage = useAuthStore((s) => s.hasPermission("services:manage"));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const load = useCallback(
    () => api.services.listAdmin?.() ?? api.services.getAll(),
    [],
  );
  const { items, loading, reload } = useAdminList(load);

  const initial = editing
    ? {
        slug: editing.slug,
        titleAr: editing.titleAr,
        titleEn: editing.titleEn,
        summaryAr: editing.summaryAr,
        summaryEn: editing.summaryEn,
        contentAr: editing.contentAr ?? "",
        contentEn: editing.contentEn ?? "",
        icon: editing.icon,
        order: String(editing.order ?? 0),
        status: editing.status ?? "draft",
        featured: editing.featured ? "true" : "false",
      }
    : { status: "published", featured: "false", order: "0", icon: "layers" };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          {locale === "ar" ? "الخدمات" : "Services"}
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
            {locale === "ar" ? "إضافة خدمة" : "Add service"}
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{locale === "ar" ? "العنوان" : "Title"}</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>{locale === "ar" ? "الحالة" : "Status"}</TableHead>
            {canManage && (
              <TableHead>{locale === "ar" ? "إجراءات" : "Actions"}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {localized(locale, row, "titleAr", "titleEn")}
              </TableCell>
              <TableCell>{row.slug}</TableCell>
              <TableCell>
                <Badge>{row.status ?? "draft"}</Badge>
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
                        await api.services.delete(row.id);
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
        title={
          editing
            ? locale === "ar"
              ? "تعديل خدمة"
              : "Edit service"
            : locale === "ar"
              ? "إضافة خدمة"
              : "Add service"
        }
        fields={serviceFields(locale)}
        initialValues={initial as Record<string, string>}
        locale={locale}
        submitLabel={locale === "ar" ? "حفظ" : "Save"}
        onSubmit={async (values) => {
          const payload = toPayload(values);
          if (editing) await api.services.update(editing.id, payload);
          else await api.services.create(payload);
          await reload();
        }}
      />
    </div>
  );
}
