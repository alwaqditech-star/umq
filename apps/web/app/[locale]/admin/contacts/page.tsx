"use client";

import { useCallback } from "react";
import { useAdminList } from "@/hooks/use-admin-list";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { api } from "@/lib/api";
import type { Contact } from "@/lib/api/types";
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
import { useAuthStore } from "@/stores/auth-store";

const statuses = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function AdminContactsPage() {
  const locale = useLocale();
  const canUpdate = useAuthStore((s) => s.hasPermission("users:update"));
  const load = useCallback(
    () => api.contacts.listAdmin?.() ?? api.contacts.getAll(),
    [],
  );
  const { items, setItems, loading, reload } = useAdminList(load);

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {locale === "ar" ? "رسائل التواصل" : "Contact messages"}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{locale === "ar" ? "الاسم" : "Name"}</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>{locale === "ar" ? "الموضوع" : "Subject"}</TableHead>
            <TableHead>{locale === "ar" ? "الحالة" : "Status"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell className="max-w-xs truncate">{row.subject}</TableCell>
              <TableCell>
                {canUpdate ? (
                  <select
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-sm"
                    value={row.status}
                    onChange={async (e) => {
                      const updated = await api.contacts.update(row.id, {
                        status: e.target.value,
                      });
                      setItems((prev) =>
                        prev.map((c) => (c.id === row.id ? updated : c)),
                      );
                    }}
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge>{row.status}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && (
        <p className="text-sm text-foreground-muted">
          {locale === "ar" ? "لا توجد رسائل بعد." : "No messages yet."}
        </p>
      )}
    </div>
  );
}
