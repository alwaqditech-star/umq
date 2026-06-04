import { PrismaClient, Locale, ContentStatus } from "@prisma/client";
import { hashPassword } from "@umq/shared";

const prisma = new PrismaClient();

const PERMISSIONS = [
  { slug: "users:read", name: "Read Users", module: "users", action: "read" },
  { slug: "users:create", name: "Create Users", module: "users", action: "create" },
  { slug: "users:update", name: "Update Users", module: "users", action: "update" },
  { slug: "users:delete", name: "Delete Users", module: "users", action: "delete" },
  { slug: "roles:read", name: "Read Roles", module: "roles", action: "read" },
  { slug: "roles:manage", name: "Manage Roles", module: "roles", action: "manage" },
  { slug: "services:read", name: "Read Services", module: "services", action: "read" },
  { slug: "services:manage", name: "Manage Services", module: "services", action: "manage" },
  { slug: "projects:read", name: "Read Projects", module: "projects", action: "read" },
  { slug: "projects:manage", name: "Manage Projects", module: "projects", action: "manage" },
  { slug: "blog:read", name: "Read Blog", module: "blog", action: "read" },
  { slug: "blog:manage", name: "Manage Blog", module: "blog", action: "manage" },
  { slug: "jobs:read", name: "Read Jobs", module: "jobs", action: "read" },
  { slug: "jobs:manage", name: "Manage Jobs", module: "jobs", action: "manage" },
  { slug: "applications:read", name: "Read Applications", module: "applications", action: "read" },
  { slug: "applications:manage", name: "Manage Applications", module: "applications", action: "manage" },
  { slug: "settings:manage", name: "Manage Settings", module: "settings", action: "manage" },
  { slug: "audit:read", name: "Read Audit Logs", module: "audit", action: "read" },
] as const;

async function assignPermissions(roleId: string, slugs: readonly string[]) {
  const permissions = await prisma.permission.findMany({
    where: { slug: { in: [...slugs] } },
  });
  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({
      roleId,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });
}

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

  await assignPermissions(
    superAdminRole.id,
    permissions.map((p) => p.slug),
  );

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

  await assignPermissions(editorRole.id, [
    "blog:read",
    "blog:manage",
    "projects:read",
    "projects:manage",
    "services:read",
    "services:manage",
  ]);

  const hrRole = await prisma.role.upsert({
    where: { slug: "hr" },
    update: {},
    create: {
      name: "HR",
      slug: "hr",
      description: "Recruitment and applications",
      isSystem: true,
    },
  });

  await assignPermissions(hrRole.id, [
    "jobs:read",
    "jobs:manage",
    "applications:read",
    "applications:manage",
  ]);

  const viewerRole = await prisma.role.upsert({
    where: { slug: "viewer" },
    update: {},
    create: {
      name: "Viewer",
      slug: "viewer",
      description: "Read-only access",
      isSystem: true,
    },
  });

  await assignPermissions(viewerRole.id, [
    "users:read",
    "roles:read",
    "services:read",
    "projects:read",
    "blog:read",
    "jobs:read",
    "applications:read",
    "audit:read",
  ]);

  const adminEmail = "admin@umq.sa";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashPassword(adminPassword) },
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

  await prisma.websiteSection.upsert({
    where: {
      key_locale: { key: "home.hero", locale: Locale.AR },
    },
    update: {},
    create: {
      key: "home.hero",
      type: "hero",
      locale: Locale.AR,
      status: ContentStatus.PUBLISHED,
      content: {
        headline: "عُمْق لتقنية المعلومات",
        subheadline: "حلول تقنية مؤسسية في المملكة العربية السعودية",
        ctaLabel: "تواصل معنا",
        ctaHref: "/contact",
      },
    },
  });

  await prisma.service.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      slug: "web-development",
      titleAr: "تطوير المواقع والتطبيقات",
      titleEn: "Web & App Development",
      summaryAr: "حلول ويب وتطبيقات مؤسسية عالية الأداء.",
      summaryEn: "High-performance enterprise web and applications.",
      icon: "code",
      order: 1,
      featured: true,
      status: ContentStatus.PUBLISHED,
    },
  });

  await prisma.service.upsert({
    where: { slug: "digital-transformation" },
    update: {},
    create: {
      slug: "digital-transformation",
      titleAr: "التحول الرقمي",
      titleEn: "Digital Transformation",
      summaryAr: "استراتيجيات وتحول رقمي متكامل للمؤسسات.",
      summaryEn: "Integrated digital transformation for enterprises.",
      icon: "sparkles",
      order: 2,
      featured: true,
      status: ContentStatus.PUBLISHED,
    },
  });

  const projectCategory = await prisma.projectCategory.upsert({
    where: { slug: "enterprise" },
    update: {},
    create: {
      slug: "enterprise",
      nameAr: "مؤسسي",
      nameEn: "Enterprise",
      order: 1,
    },
  });

  await prisma.project.upsert({
    where: { slug: "umq-platform" },
    update: {},
    create: {
      slug: "umq-platform",
      titleAr: "منصة عُمْق",
      titleEn: "UMQ Platform",
      summaryAr: "منصة مؤسسية لإدارة المحتوى والخدمات.",
      summaryEn: "Enterprise platform for content and services.",
      clientName: "UMQ",
      technologies: ["Next.js", "NestJS", "MySQL"],
      categoryId: projectCategory.id,
      featured: true,
      status: ContentStatus.PUBLISHED,
    },
  });

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "insights" },
    update: {},
    create: {
      slug: "insights",
      nameAr: "رؤى تقنية",
      nameEn: "Tech Insights",
    },
  });

  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });

  await prisma.blogPost.upsert({
    where: {
      slug_locale: { slug: "digital-transformation-ksa", locale: Locale.AR },
    },
    update: {},
    create: {
      slug: "digital-transformation-ksa",
      locale: Locale.AR,
      title: "التحول الرقمي في السعودية",
      excerpt: "كيف تبني المؤسسات رحلة تحول رقمي ناجحة.",
      content: "<p>محتوى المقال التعريفي عن التحول الرقمي.</p>",
      categoryId: blogCategory.id,
      authorId: adminUser?.id,
      readingTime: 6,
      publishedAt: new Date(),
      status: ContentStatus.PUBLISHED,
    },
  });

  const jobCategory = await prisma.jobCategory.upsert({
    where: { slug: "engineering" },
    update: {},
    create: {
      slug: "engineering",
      nameAr: "هندسة البرمجيات",
      nameEn: "Engineering",
    },
  });

  await prisma.job.upsert({
    where: { slug: "senior-fullstack-developer" },
    update: {},
    create: {
      slug: "senior-fullstack-developer",
      titleAr: "مطور Full Stack أول",
      titleEn: "Senior Full Stack Developer",
      descriptionAr: "نبحث عن مطور ذو خبرة في Next.js و NestJS.",
      descriptionEn: "We are hiring an experienced Next.js and NestJS developer.",
      location: "الرياض",
      employmentType: "full-time",
      categoryId: jobCategory.id,
      status: ContentStatus.PUBLISHED,
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        authorAr: "أحمد العتيبي",
        authorEn: "Ahmed Al-Otaibi",
        companyAr: "شركة تقنية",
        companyEn: "Tech Corp",
        contentAr: "فريق عُمْق قدم لنا حلولاً متميزة ودعماً مستمراً.",
        contentEn: "UMQ delivered outstanding solutions and support.",
        rating: 5,
        order: 1,
        status: ContentStatus.PUBLISHED,
      },
    ],
    skipDuplicates: true,
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
