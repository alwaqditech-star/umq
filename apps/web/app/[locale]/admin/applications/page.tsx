"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Application } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocale } from "@/lib/i18n/use-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useAuthStore } from "@/stores/auth-store";

const statusVariant: Record<
  Application["status"],
  "default" | "success" | "warning" | "danger"
> = {
  new: "default",
  reviewing: "warning",
  shortlisted: "success",
  rejected: "danger",
};

export default function ApplicationsAdminPage() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManage = hasPermission("applications:manage");
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.applications
      .getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: Application["status"]) => {
    if (!canManage) return;
    const updated = await api.applications.update(id, { status });
    setItems((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{dict.admin.applications}</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          {locale === "ar"
            ? "مراجعة طلبات التوظيف المقدمة من الموقع العام"
            : "Review job applications submitted from the public site"}
        </p>
      </div>

      {loading ? (
        <p className="text-foreground-muted">
          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      ) : items.length === 0 ? (
        <Badge variant="warning">
          {locale === "ar" ? "لا توجد طلبات بعد" : "No applications yet"}
        </Badge>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{locale === "ar" ? "المتقدم" : "Applicant"}</TableHead>
              <TableHead>{locale === "ar" ? "الوظيفة" : "Job"}</TableHead>
              <TableHead>{locale === "ar" ? "الحالة" : "Status"}</TableHead>
              <TableHead>{locale === "ar" ? "تاريخ التقديم" : "Applied"}</TableHead>
              {canManage && (
                <TableHead>{locale === "ar" ? "إجراء" : "Action"}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-medium">{row.applicantName}</p>
                  <p className="text-xs text-foreground-muted">{row.email}</p>
                </TableCell>
                <TableCell>{row.jobTitle ?? row.jobId}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(row.appliedAt).toLocaleDateString(
                    locale === "ar" ? "ar-SA" : "en-US",
                  )}
                </TableCell>
                {canManage && (
                  <TableCell>
                    <select
                      className="rounded-lg border border-border bg-surface px-2 py-1 text-sm"
                      value={row.status}
                      onChange={(e) =>
                        void handleStatusChange(
                          row.id,
                          e.target.value as Application["status"],
                        )
                      }
                    >
                      <option value="new">new</option>
                      <option value="reviewing">reviewing</option>
                      <option value="shortlisted">shortlisted</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
