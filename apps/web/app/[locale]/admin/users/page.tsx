"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/api/types";
import { EntityTable } from "@/components/admin/entity-table";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminUsersPage() {
  const locale = useLocale();
  const [users, setUsers] = useState<User[]>([]);

  const load = useCallback(async () => {
    setUsers(await api.users.getAll());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <EntityTable
      title={locale === "ar" ? "المستخدمون" : "Users"}
      createLabel={locale === "ar" ? "إضافة مستخدم" : "Add user"}
      rows={users}
      columns={[
        { key: "name", header: "Name", render: (r) => r.name },
        { key: "email", header: "Email", render: (r) => r.email },
        { key: "role", header: "Role", render: (r) => r.role },
        {
          key: "status",
          header: "Status",
          render: (r) => (
            <Badge variant={r.status === "active" ? "success" : "default"}>
              {r.status}
            </Badge>
          ),
        },
      ]}
      onCreate={async (data) => {
        await api.users.create({
          name: data.name ?? "New User",
          email: `${Date.now()}@umq.sa`,
          role: "Viewer",
          status: "active",
          lastLogin: new Date().toISOString().slice(0, 10),
        });
        await load();
      }}
      onUpdate={async (id, data) => {
        await api.users.update(id, { name: data.name });
        await load();
      }}
      onDelete={async (id) => {
        await api.users.delete(id);
        await load();
      }}
    />
  );
}
