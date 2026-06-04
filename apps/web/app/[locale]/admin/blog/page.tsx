"use client";

import { useCallback, useState } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/api/types";
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
import { useLocale } from "@/lib/i18n/use-locale";
import { useAuthStore } from "@/stores/auth-store";
import { resolveMediaUrl } from "@/lib/media-url";

const blogFields = (locale: "ar" | "en") => [
  { name: "slug", label: "Slug", required: true },
  {
    name: "title",
    label: locale === "ar" ? "العنوان" : "Title",
    required: true,
  },
  {
    name: "excerpt",
    label: locale === "ar" ? "مقتطف" : "Excerpt",
    type: "textarea" as const,
  },
  {
    name: "content",
    label: locale === "ar" ? "المحتوى" : "Content",
    type: "textarea" as const,
    rows: 8,
    required: true,
  },
  {
    name: "locale",
    label: locale === "ar" ? "اللغة" : "Locale",
    type: "select" as const,
    options: [
      { value: "ar", label: "العربية" },
      { value: "en", label: "English" },
    ],
  },
  {
    name: "readingTime",
    label: locale === "ar" ? "وقت القراءة (دقائق)" : "Reading time",
    type: "number" as const,
  },
  {
    name: "publishedAt",
    label: locale === "ar" ? "تاريخ النشر" : "Published at",
    placeholder: "2026-06-04",
  },
  {
    name: "status",
    label: locale === "ar" ? "الحالة" : "Status",
    type: "select" as const,
    options: contentStatusOptions(locale),
  },
  {
    name: "coverMediaId",
    label: locale === "ar" ? "صورة الغلاف" : "Cover image",
    type: "image" as const,
    uploadFolder: "blog",
  },
];

export default function AdminBlogPage() {
  const locale = useLocale();
  const canManage = useAuthStore((s) => s.hasPermission("blog:manage"));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const load = useCallback(
    () => api.blog.listAdmin?.() ?? api.blog.getAll(),
    [],
  );
  const { items, loading, reload } = useAdminList(load);

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          {locale === "ar" ? "المدونة" : "Blog"}
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
            {locale === "ar" ? "مقال جديد" : "New post"}
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Locale</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.locale ?? "ar"}</TableCell>
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
                        await api.blog.delete(row.id);
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
        title={editing ? "Edit post" : "New post"}
        fields={blogFields(locale)}
        initialValues={
          editing
            ? {
                slug: editing.slug,
                title: editing.title ?? editing.titleAr,
                excerpt: editing.excerpt ?? editing.excerptAr,
                content: editing.content ?? "",
                locale: editing.locale ?? "ar",
                readingTime: String(editing.readingTime),
                publishedAt: editing.publishedAt?.slice(0, 10) ?? "",
                status: editing.status ?? "draft",
                coverMediaId: editing.coverMediaId ?? "",
              }
            : {
                locale: "ar",
                status: "published",
                readingTime: "5",
                coverMediaId: "",
              }
        }
        imagePreviews={
          editing?.coverImageUrl
            ? {
                coverMediaId:
                  resolveMediaUrl(editing.coverImageUrl) ??
                  editing.coverImageUrl,
              }
            : {}
        }
        locale={locale}
        submitLabel="Save"
        onSubmit={async (values) => {
          const payload = {
            slug: values.slug,
            title: values.title,
            excerpt: values.excerpt,
            content: values.content,
            locale: values.locale,
            readingTime: Number(values.readingTime || 5),
            publishedAt: values.publishedAt || undefined,
            status: values.status || "draft",
            coverMediaId: values.coverMediaId?.trim() || null,
          };
          if (editing) await api.blog.update(editing.id, payload);
          else await api.blog.create(payload);
          await reload();
        }}
      />
    </div>
  );
}
