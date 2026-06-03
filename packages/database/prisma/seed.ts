import { PrismaClient, Locale } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const PERMISSIONS = [
  { slug: "users:read", name: "Read Users", module: "users", action: "read" },
  {
    slug: "users:create",
    name: "Create Users",
    module: "users",
    action: "create",
  },
  {
    slug: "users:update",
    name: "Update Users",
    module: "users",
    action: "update",
  },
  {
    slug: "users:delete",
    name: "Delete Users",
    module: "users",
    action: "delete",
  },
  { slug: "roles:read", name: "Read Roles", module: "roles", action: "read" },
  {
    slug: "roles:manage",
    name: "Manage Roles",
    module: "roles",
    action: "manage",
  },
  { slug: "blog:read", name: "Read Blog", module: "blog", action: "read" },
  {
    slug: "blog:manage",
    name: "Manage Blog",
    module: "blog",
    action: "manage",
  },
  { slug: "jobs:read", name: "Read Jobs", module: "jobs", action: "read" },
  {
    slug: "jobs:manage",
    name: "Manage Jobs",
    module: "jobs",
    action: "manage",
  },
  {
    slug: "settings:manage",
    name: "Manage Settings",
    module: "settings",
    action: "manage",
  },
  {
    slug: "audit:read",
    name: "Read Audit Logs",
    module: "audit",
    action: "read",
  },
] as const;

async function main() {
  console.log("Seeding UMQ platform database...");

  const permissions = await Promise.all(
    PERMISSIONS.map((p) =>
      prisma.permission.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          name: p.name,
          module: p.module,
          action: p.action,
        },
      }),
    ),
  );

  const superAdminRole = await prisma.role.upsert({
    where: { slug: "super-admin" },
    update: {},
    create: {
      name: "Super Admin",
      slug: "super-admin",
      description: "Full platform access",
      isSystem: true,
    },
  });

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({
      roleId: superAdminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  const editorRole = await prisma.role.upsert({
    where: { slug: "editor" },
    update: {},
    create: {
      name: "Editor",
      slug: "editor",
      description: "Content management",
      isSystem: true,
    },
  });

  const editorPermissionSlugs = ["blog:read", "blog:manage", "jobs:read"];
  const editorPermissions = permissions.filter((p) =>
    editorPermissionSlugs.includes(p.slug),
  );

  await prisma.rolePermission.createMany({
    data: editorPermissions.map((permission) => ({
      roleId: editorRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  const adminEmail = "admin@umq.sa";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      firstName: "System",
      lastName: "Administrator",
      roleId: superAdminRole.id,
      locale: Locale.AR,
      isActive: true,
    },
  });

  await prisma.setting.upsert({
    where: { key: "company.name" },
    update: {},
    create: {
      key: "company.name",
      group: "general",
      value: {
        ar: "عُمْق لتقنية المعلومات",
        en: "UMQ Information Technology",
      },
    },
  });

  await prisma.setting.upsert({
    where: { key: "company.country" },
    update: {},
    create: {
      key: "company.country",
      group: "general",
      value: { code: "SA", name: "Saudi Arabia" },
    },
  });

  await prisma.websiteSection.upsert({
    where: {
      key_locale: {
        key: "home.hero",
        locale: Locale.AR,
      },
    },
    update: {},
    create: {
      key: "home.hero",
      type: "hero",
      locale: Locale.AR,
      status: "PUBLISHED",
      content: {
        headline: "عُمْق لتقنية المعلومات",
        subheadline: "حلول تقنية مؤسسية في المملكة العربية السعودية",
        ctaLabel: "تواصل معنا",
        ctaHref: "/contact",
      },
    },
  });

  await prisma.seoPage.upsert({
    where: {
      path_locale: {
        path: "/",
        locale: Locale.AR,
      },
    },
    update: {},
    create: {
      path: "/",
      locale: Locale.AR,
      title: "عُمْق لتقنية المعلومات",
      description: "حلول تقنية المعلومات والتحول الرقمي في السعودية",
      robots: "index,follow",
    },
  });

  console.log("Seed completed.");
  console.log(`Admin user: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
