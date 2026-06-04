# UI Redesign Report — UMQ Platform

**Date:** 2025-06-06  
**Status:** Phase 1 premium public site + dynamic CMS sections

## Summary

The public experience was redesigned toward enterprise SaaS quality while preserving UMQ brand colors. All homepage sections are driven by the `home_sections` registry in MySQL. Blog, contact, projects, and error pages were rebuilt with Framer Motion, premium surfaces, and live API data.

## Backend

- New table `home_sections` + migration `20250606120000_home_sections_blog_tags`
- `BlogPost.tags` JSON column
- Public: `GET /home-sections`, `GET /settings/public`, `GET /search`
- Blog: cover, author, related posts, bilingual category
- Projects: `coverImageUrl` in API responses

## Frontend

- `SiteConfigProvider` + `DynamicHome`
- Premium blog, contact, projects, 404/403
- Admin `/admin/website-sections`

## Validation

Run after pull:

```bash
pnpm db:migrate
pnpm db:seed
pnpm --filter @umq/shared build
pnpm check-types
pnpm build
pnpm lint
```

## Demo

Disable **Blog** in admin website sections → blog link disappears; `/ar/blog` shows 404.
