# Blog System

## Data flow

`MySQL` → `Prisma BlogPost` → `NestJS /api/v1/blog/posts` → `Next.js`

## Public routes

- `GET /blog/posts?locale=ar|en` — list
- `GET /blog/posts/:slug?locale=` — detail
- `GET /blog/posts/:slug/related?locale=` — related posts

## Fields (API)

- Cover: `coverImageUrl` from `coverMediaId`
- Author: from `authorId` → User name
- Category: bilingual `categoryAr` / `categoryEn`
- Tags: JSON array on post

## Web pages

- `/[locale]/blog` — grid with image, author, date, reading time
- `/[locale]/blog/[slug]` — cover, content, tags, share, related

## SEO

- `generateMetadata` loads `SeoPage` via `GET /seo?path=&locale=`
- JSON-LD `BlogPosting` on detail page
- Open Graph / Twitter from metadata

## CMS gate

If `home_sections.key = blog` is **disabled**:

- Hidden from home, nav, footer
- `/blog` returns **404**
