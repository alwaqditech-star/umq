import {
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import type { AdminNavItem } from "@/lib/admin/nav-config";
import { filterNavByPermissions } from "@/lib/admin/nav-config";

export const editorNavItems: AdminNavItem[] = [
  { key: "dashboard", href: "/editor", icon: LayoutDashboard, permissions: [] },
  {
    key: "blog",
    href: "/editor/blog",
    icon: FileText,
    permissions: ["blog:read"],
  },
  {
    key: "projects",
    href: "/editor/projects",
    icon: FolderKanban,
    permissions: ["projects:read"],
  },
  {
    key: "media",
    href: "/editor/media",
    icon: ImageIcon,
    permissions: ["cms:manage"],
  },
  {
    key: "account",
    href: "/editor/account",
    icon: UserCircle,
    permissions: [],
  },
];

export { filterNavByPermissions };
