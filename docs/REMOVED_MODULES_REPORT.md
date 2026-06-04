# Removed Modules Report

**تاريخ:** 2026-06-05

## Recruitment (حذف كامل)

### Database

- Tables dropped: `applications`, `jobs`, `job_categories`
- Prisma models removed: `Job`, `JobCategory`, `Application`, `ApplicationStatus`
- Migration: `20250605120000_remove_recruitment_rbac`

### API (NestJS)

- `apps/api/src/jobs/` — deleted
- `apps/api/src/applications/` — deleted
- `JobCategoriesAdminController` — deleted

### Web (Next.js)

- `/[locale]/careers` — deleted
- `/[locale]/admin/jobs` — deleted
- `/[locale]/admin/applications` — deleted
- `api.jobs`, `api.applications`, `categories.jobs` — removed from client

## Roles & Portal (حذف)

### Roles removed from seed & DB cleanup

`hr`, `viewer`, `manager`, `employee`, `customer`, `project_manager`, `content_manager`

### Permissions removed

`jobs:*`, `applications:*`, `portal:access`

### Customer portal

- `apps/api/src/customer/` — deleted
- `/[locale]/customer/*` — deleted
- `httpCustomer.ts` — deleted

## Public admin UI

- `components/public/public-nav-auth.tsx` — deleted
