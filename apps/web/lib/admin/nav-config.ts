import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Layers,
  Shield,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  /** Any of these permissions grants access; empty = all authenticated users */
  permissions: string[];
};

export const adminNavItems: AdminNavItem[] = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard, permissions: [] },
  {
    key: "users",
    href: "/admin/users",
    icon: Users,
    permissions: ["users:read"],
  },
  {
    key: "roles",
    href: "/admin/roles",
    icon: Shield,
    permissions: ["roles:read"],
  },
  {
    key: "services",
    href: "/admin/services",
    icon: Layers,
    permissions: ["services:read"],
  },
  {
    key: "projects",
    href: "/admin/projects",
    icon: FolderKanban,
    permissions: ["projects:read"],
  },
  {
    key: "blog",
    href: "/admin/blog",
    icon: FileText,
    permissions: ["blog:read"],
  },
  {
    key: "jobs",
    href: "/admin/jobs",
    icon: Briefcase,
    permissions: ["jobs:read"],
  },
  {
    key: "applications",
    href: "/admin/applications",
    icon: ClipboardList,
    permissions: ["applications:read"],
  },
];

export function filterNavByPermissions(
  items: AdminNavItem[],
  hasPermission: (perm: string) => boolean,
): AdminNavItem[] {
  return items.filter(
    (item) =>
      item.permissions.length === 0 ||
      item.permissions.some((perm) => hasPermission(perm)),
  );
}
