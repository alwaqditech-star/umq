"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Role, User } from "@/lib/api/types";
import { AdminFormModal } from "@/components/admin/form-modal";
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
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";

export default function AdminUsersPage() {
  const locale = useLocale();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canCreate = hasPermission("users:create");
  const canUpdate = hasPermission("users:update");
  const canDelete = hasPermission("users:delete");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        api.users.listAdmin?.() ?? api.users.getAll(),
        api.users.getRoles(),
      ]);
      setUsers(u);
      setRoles(r);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  if (loading) {
    return <AdminPageSkeleton />;
  }

  const fields = [
    {
      name: "firstName",
      label: locale === "ar" ? "الاسم الأول" : "First name",
      required: true,
    },
    {
      name: "lastName",
      label: locale === "ar" ? "اسم العائلة" : "Last name",
      required: true,
    },
    { name: "email", label: "Email", type: "email" as const, required: true },
    ...(editing
      ? []
      : [
          {
            name: "password",
            label: locale === "ar" ? "كلمة المرور" : "Password",
            type: "password" as const,
            required: true,
          },
        ]),
    {
      name: "roleId",
      label: locale === "ar" ? "الدور" : "Role",
      type: "select" as const,
      options: roleOptions,
      required: true,
    },
    {
      name: "isActive",
      label: locale === "ar" ? "نشط" : "Active",
      type: "select" as const,
      options: [
        { value: "true", label: locale === "ar" ? "نعم" : "Yes" },
        { value: "false", label: locale === "ar" ? "لا" : "No" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          {locale === "ar" ? "المستخدمون" : "Users"}
        </h2>
        {canCreate && (
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {locale === "ar" ? "إضافة مستخدم" : "Add user"}
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            {(canUpdate || canDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>
                <Badge
                  variant={row.status === "active" ? "success" : "default"}
                >
                  {row.status}
                </Badge>
              </TableCell>
              {(canUpdate || canDelete) && (
                <TableCell>
                  <div className="flex gap-2">
                    {canUpdate && (
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
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        className="rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                        onClick={async () => {
                          await api.users.delete(row.id);
                          await load();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(canCreate || canUpdate) && (
        <AdminFormModal
          open={open}
          onClose={() => setOpen(false)}
          title={editing ? "Edit user" : "Add user"}
          fields={fields}
          initialValues={
            {
              ...(editing
                ? {
                    firstName:
                      editing.firstName ?? editing.name.split(" ")[0] ?? "",
                    lastName:
                      editing.lastName ??
                      editing.name.split(" ").slice(1).join(" ") ??
                      "",
                    email: editing.email,
                    roleId: editing.roleId ?? "",
                    isActive: editing.status === "active" ? "true" : "false",
                  }
                : { isActive: "true", roleId: roles[0]?.id ?? "" }),
            } as Record<string, string>
          }
          locale={locale}
          submitLabel="Save"
          onSubmit={async (values) => {
            if (editing) {
              await api.users.update(editing.id, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                roleId: values.roleId,
                isActive: values.isActive === "true",
              });
            } else {
              await api.users.create({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                roleId: values.roleId,
              });
            }
            await load();
          }}
        />
      )}
    </div>
  );
}
