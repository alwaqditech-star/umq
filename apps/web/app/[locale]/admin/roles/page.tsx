"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Role } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AdminRolesPage() {
  const locale = useLocale();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    void api.users.getRoles().then(setRoles);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold">
        {locale === "ar" ? "الأدوار والصلاحيات" : "Roles & Permissions"}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.id} hover>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{role.name}</h3>
              <Badge variant="accent">{role.usersCount} users</Badge>
            </div>
            <p className="mt-2 text-sm text-foreground-muted">{role.slug}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.permissions.map((p) => (
                <Badge key={p} variant="default">
                  {p}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
