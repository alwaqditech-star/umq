"use client";

import { useCallback, useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/use-locale";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";

type SectionRow = {
  id: string;
  key: string;
  labelAr: string;
  labelEn: string;
  isEnabled: boolean;
  sortOrder: number;
};

export default function WebsiteSectionsAdminPage() {
  const locale = useLocale();
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.cms.homeSections.list();
      setRows(data as SectionRow[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRow = async (
    id: string,
    patch: Partial<Pick<SectionRow, "labelAr" | "labelEn" | "isEnabled">>,
  ) => {
    setSaving(true);
    try {
      await api.cms.homeSections.update(id, patch);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= rows.length) return;
    const copy = [...rows];
    const a = copy[index];
    const b = copy[next];
    if (!a || !b) return;
    const items = copy.map((r, i) => {
      if (i === index) return { id: r.id, sortOrder: b.sortOrder };
      if (i === next) return { id: r.id, sortOrder: a.sortOrder };
      return { id: r.id, sortOrder: r.sortOrder };
    });
    setSaving(true);
    try {
      await api.cms.homeSections.reorder(items);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "أقسام الموقع" : "Website sections"}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {locale === "ar"
            ? "تفعيل، تعطيل، ترتيب، وإعادة تسمية أقسام الصفحة الرئيسية."
            : "Enable, disable, reorder, and rename homepage sections."}
        </p>
      </div>

      {loading ? (
        <AdminPageSkeleton />
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <Card
              key={row.id}
              padding="md"
              className="flex flex-col gap-4 lg:flex-row lg:items-center"
            >
              <div className="flex items-center gap-2 text-foreground-muted">
                <GripVertical className="h-4 w-4" />
                <code className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  {row.key}
                </code>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <Input
                  label={locale === "ar" ? "الاسم (عربي)" : "Label (AR)"}
                  value={row.labelAr}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, labelAr: e.target.value } : r,
                      ),
                    )
                  }
                  onBlur={() => updateRow(row.id, { labelAr: row.labelAr })}
                />
                <Input
                  label={locale === "ar" ? "الاسم (إنجليزي)" : "Label (EN)"}
                  value={row.labelEn}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, labelEn: e.target.value } : r,
                      ),
                    )
                  }
                  onBlur={() => updateRow(row.id, { labelEn: row.labelEn })}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={row.isEnabled}
                    onChange={(e) =>
                      updateRow(row.id, { isEnabled: e.target.checked })
                    }
                    className="rounded border-border"
                  />
                  {locale === "ar" ? "مفعّل" : "Enabled"}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === 0 || saving}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === rows.length - 1 || saving}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
