# API Documentation — UMQ Platform

Base URL: `/api/v1`  
Auth: HttpOnly cookies `umq_access`, `umq_refresh` (or `Authorization: Bearer` for tooling).

## Auth

| Method | Path                           | Auth   | Description                                         |
| ------ | ------------------------------ | ------ | --------------------------------------------------- |
| POST   | `/auth/login`                  | Public | Login → sets cookies, returns `{ user, expiresIn }` |
| POST   | `/auth/refresh`                | Public | Rotate session                                      |
| POST   | `/auth/logout`                 | Yes    | Revoke refresh + clear cookies                      |
| GET    | `/auth/me`                     | Yes    | Current user                                        |
| POST   | `/auth/forgot-password`        | Public | Request reset (dev: `resetUrl` in response)         |
| POST   | `/auth/reset-password`         | Public | Reset with token                                    |
| POST   | `/auth/change-password`        | Yes    | Change password, clears session                     |
| GET    | `/auth/sessions`               | Yes    | List refresh sessions                               |
| DELETE | `/auth/sessions/:id`           | Yes    | Revoke session                                      |
| POST   | `/auth/sessions/revoke-others` | Yes    | Revoke other devices                                |

## Categories (admin)

| Method       | Path                            | Permission        |
| ------------ | ------------------------------- | ----------------- |
| GET/POST     | `/admin/project-categories`     | `projects:manage` |
| PATCH/DELETE | `/admin/project-categories/:id` | `projects:manage` |
| GET/POST     | `/admin/blog-categories`        | `blog:manage`     |
| PATCH/DELETE | `/admin/blog-categories/:id`    | `blog:manage`     |
| GET/POST     | `/admin/job-categories`         | `jobs:manage`     |
| PATCH/DELETE | `/admin/job-categories/:id`     | `jobs:manage`     |

## Content (public + admin)

- **Services:** `GET /services`, `GET/POST/PATCH/DELETE /admin/services`
- **Projects:** `GET /projects`, `GET /projects/:slug`, admin CRUD `/admin/projects`
- **Blog:** `GET /blog/posts`, `GET /blog/posts/:slug?locale=`, admin `/admin/blog/posts`
- **Jobs:** `GET /jobs`, `GET /jobs/:slug`, `POST /jobs/:slug/apply`, admin `/admin/jobs`
- **Applications:** admin `/admin/applications`
- **Contacts:** `POST /contacts`, admin `/admin/contacts`
- **Testimonials:** `GET /testimonials`, admin `/admin/testimonials`

## CMS (admin)

| Area             | Base path                 | Permission        |
| ---------------- | ------------------------- | ----------------- |
| Team             | `/admin/team-members`     | `cms:manage`      |
| Partners         | `/admin/partners`         | `cms:manage`      |
| Settings         | `/admin/settings`         | `settings:manage` |
| Website sections | `/admin/website-sections` | `cms:manage`      |
| SEO              | `/admin/seo-pages`        | `cms:manage`      |
| Audit logs       | `/admin/audit-logs`       | `audit:read`      |
| Dashboard stats  | `/admin/dashboard/stats`  | any authenticated |

## Media

| Method | Path                  | Description                                                 |
| ------ | --------------------- | ----------------------------------------------------------- |
| GET    | `/admin/media`        | List library                                                |
| POST   | `/admin/media/upload` | Multipart field `file`, optional `folder`, `altAr`, `altEn` |
| DELETE | `/admin/media/:id`    | Soft-delete + remove file                                   |
| GET    | `/media/files/*`      | Public file serve                                           |

## Customer portal

| Method | Path                               | Permission      |
| ------ | ---------------------------------- | --------------- |
| GET    | `/customer/me`                     | `portal:access` |
| GET    | `/customer/summary`                | `portal:access` |
| GET    | `/customer/notifications`          | `portal:access` |
| PATCH  | `/customer/notifications/:id/read` | `portal:access` |

## Users & roles

- `/users` — CRUD (admin)
- `/roles` — list/read

## Health

`GET /health` — public

## Audit

All mutating requests (except auth/health) are logged to `audit_logs` automatically.
