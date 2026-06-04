"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaCoverInput } from "@/components/admin/media-cover-input";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "email" | "password" | "number" | "select" | "checkbox" | "image";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  /** Used when type is "image" — media library folder */
  uploadFolder?: string;
};

export function AdminFormModal({
  open,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
  submitLabel,
  locale,
  imagePreviews: imagePreviewsProp = {},
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, string | boolean>;
  /** Preview URLs for image fields, keyed by field name */
  imagePreviews?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitLabel: string;
  locale: "ar" | "en";
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next: Record<string, string> = {};
    for (const field of fields) {
      const raw = initialValues[field.name];
      next[field.name] =
        typeof raw === "boolean" ? (raw ? "true" : "false") : String(raw ?? "");
    }
    setValues(next);
    setImagePreviews(imagePreviewsProp);
  }, [open, fields, initialValues, imagePreviewsProp]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pe-1">
        {fields.map((field) => {
          if (field.type === "image") {
            return (
              <MediaCoverInput
                key={field.name}
                mediaId={values[field.name] ?? ""}
                previewUrl={imagePreviews[field.name]}
                folder={field.uploadFolder ?? "general"}
                locale={locale}
                onChange={(id, url) => {
                  setValues((v) => ({ ...v, [field.name]: id }));
                  setImagePreviews((p) => ({ ...p, [field.name]: url }));
                }}
              />
            );
          }
          if (field.type === "textarea") {
            return (
              <div key={field.name}>
                <label className="text-sm font-medium">{field.label}</label>
                <textarea
                  className="mt-1.5 min-h-[88px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  rows={field.rows ?? 4}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                />
              </div>
            );
          }
          if (field.type === "select") {
            return (
              <div key={field.name}>
                <label className="text-sm font-medium">{field.label}</label>
                <select
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                >
                  <option value="">
                    {locale === "ar" ? "— اختر —" : "— Select —"}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.type === "checkbox") {
            return (
              <label
                key={field.name}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={values[field.name] === "true"}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [field.name]: e.target.checked ? "true" : "false",
                    }))
                  }
                  className="rounded border-border"
                />
                {field.label}
              </label>
            );
          }
          return (
            <Input
              key={field.name}
              label={field.label}
              type={field.type ?? "text"}
              value={values[field.name] ?? ""}
              placeholder={field.placeholder}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field.name]: e.target.value }))
              }
            />
          );
        })}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          {locale === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button loading={loading} onClick={() => void handleSubmit()}>
          {submitLabel}
        </Button>
      </div>
    </Modal>
  );
}

export const contentStatusOptions = (locale: "ar" | "en") => [
  { value: "published", label: locale === "ar" ? "منشور" : "Published" },
  { value: "draft", label: locale === "ar" ? "مسودة" : "Draft" },
  { value: "inactive", label: locale === "ar" ? "غير نشط" : "Inactive" },
];
