# CMS Dynamic Sections

## Model: `home_sections`

| Field                 | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `key`                 | `hero`, `services`, `projects`, `blog`, … |
| `labelAr` / `labelEn` | Admin display name                        |
| `isEnabled`           | Show/hide on site                         |
| `sortOrder`           | Homepage order                            |

## Admin

**`/admin/website-sections`** — enable, disable, rename, reorder.

Permissions: `cms:manage`

## Public API

`GET /api/v1/home-sections` — enabled sections only, sorted.

## Frontend rule

`DynamicHome` renders a section only if `enabledKeys.has(key)`.

`SiteConfigProvider` supplies `enabledKeys` to navbar/footer (blog link).

## Content blocks

`website_sections` table still holds JSON content (e.g. `home.hero`, `contact.faq`).

Admin content: `POST /admin/website-sections/content`
