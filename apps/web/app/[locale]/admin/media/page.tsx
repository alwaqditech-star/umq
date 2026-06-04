"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { resolveMediaUrl } from "@/lib/media-url";
import { useLocale } from "@/lib/i18n/use-locale";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string;
};

export default function AdminMediaPage() {
  const locale = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("general");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(
    () => api.cms.media.list() as Promise<MediaItem[]>,
    [],
  );
  const { items, loading, reload } = useAdminList(load);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      await api.cms.media.upload(fd);
      if (fileRef.current) fileRef.current.value = "";
      await reload();
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        {locale === "ar" ? "مكتبة الوسائط" : "Media library"}
      </h1>
      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-border p-6">
        <label className="block text-sm">
          {locale === "ar" ? "المجلد" : "Folder"}
          <input
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          />
        </label>
        <div>
          <label className="text-sm font-medium">
            {locale === "ar" ? "ملف" : "File"}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="mt-1 block text-sm"
          />
        </div>
        <Button onClick={handleUpload} loading={uploading}>
          {locale === "ar" ? "رفع" : "Upload"}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border p-4 space-y-2"
          >
            {item.mimeType.startsWith("image/") ? (
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <Image
                  src={resolveMediaUrl(item.url) ?? item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg bg-surface text-sm">
                {item.mimeType}
              </div>
            )}
            <p className="truncate text-sm font-medium">{item.filename}</p>
            <p className="text-xs text-foreground-muted">
              {item.folder} · {(item.size / 1024).toFixed(1)} KB
            </p>
            <Button
              size="sm"
              variant="danger"
              onClick={async () => {
                await api.cms.media.delete(item.id);
                await reload();
              }}
            >
              {locale === "ar" ? "حذف" : "Delete"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
