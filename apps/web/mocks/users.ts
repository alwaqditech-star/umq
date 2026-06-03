import type { Role, User } from "@/lib/api/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "مدير النظام",
    email: "admin@umq.sa",
    role: "Super Admin",
    status: "active",
    lastLogin: "2026-03-06",
  },
  {
    id: "2",
    name: "سارة العتيبي",
    email: "sara@umq.sa",
    role: "Editor",
    status: "active",
    lastLogin: "2026-03-05",
  },
  {
    id: "3",
    name: "خالد المنصور",
    email: "khalid@umq.sa",
    role: "HR",
    status: "active",
    lastLogin: "2026-03-04",
  },
  {
    id: "4",
    name: "محمد الحربي",
    email: "mohammed@umq.sa",
    role: "Viewer",
    status: "inactive",
    lastLogin: "2026-01-12",
  },
];

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    slug: "super-admin",
    usersCount: 1,
    permissions: ["*"],
  },
  {
    id: "2",
    name: "Editor",
    slug: "editor",
    usersCount: 3,
    permissions: ["blog:manage", "projects:manage", "services:manage"],
  },
  {
    id: "3",
    name: "HR",
    slug: "hr",
    usersCount: 2,
    permissions: ["jobs:manage", "applications:read"],
  },
  {
    id: "4",
    name: "Viewer",
    slug: "viewer",
    usersCount: 5,
    permissions: ["*:read"],
  },
];
