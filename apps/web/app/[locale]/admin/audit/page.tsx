"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLocale } from "@/lib/i18n/use-locale";

type AuditRow = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: string;
  user: { email: string; firstName: string; lastName: string } | null;
};

export default function AdminAuditPage() {
  const locale = useLocale();
  const [rows, setRows] = useState<AuditRow[]>([]);

  useEffect(() => {
    void api.cms.auditLogs(100).then((data) => setRows(data as AuditRow[]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {locale === "ar" ? "سجل التدقيق" : "Audit logs"}
      </h1>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-table-header">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                {locale === "ar" ? "الوقت" : "Time"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                {locale === "ar" ? "المستخدم" : "User"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                {locale === "ar" ? "الإجراء" : "Action"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header">
                {locale === "ar" ? "الكيان" : "Entity"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-foreground-muted"
                >
                  {locale === "ar" ? "لا سجلات بعد" : "No audit entries yet"}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{row.user?.email ?? "—"}</td>
                  <td className="px-4 py-3">{row.action}</td>
                  <td className="px-4 py-3">
                    {row.entity}
                    {row.entityId ? ` #${row.entityId.slice(0, 8)}` : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
