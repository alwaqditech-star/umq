import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Layers,
  LayoutTemplate,
  Shield,
  Star,
  Tags,
  UserCircle,
  Users,
  ScrollText,
  ImageIcon,
} from "lucide-react";

export type AdminNavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  /** Any of these permissions grants access; empty = all authenticated admin users */
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
    key: "contacts",
    href: "/admin/contacts",
    icon: Inbox,
    permissions: ["users:read"],
  },
  {
    key: "account",
    href: "/admin/account",
    icon: UserCircle,
    permissions: [],
  },
  {
    key: "categories",
    href: "/admin/categories",
    icon: Tags,
    permissions: ["projects:manage", "blog:manage"],
  },
  {
    key: "websiteSections",
    href: "/admin/website-sections",
    icon: LayoutTemplate,
    permissions: ["cms:manage"],
  },
  {
    key: "testimonials",
    href: "/admin/testimonials",
    icon: Star,
    permissions: ["cms:manage"],
  },
  {
    key: "media",
    href: "/admin/media",
    icon: ImageIcon,
    permissions: ["cms:manage"],
  },
  {
    key: "audit",
    href: "/admin/audit",
    icon: ScrollText,
    permissions: ["audit:read"],
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
