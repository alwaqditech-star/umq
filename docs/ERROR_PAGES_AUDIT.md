# Error Pages Audit

## 404 — `/[locale]/not-found.tsx`

- Premium layout with mesh background
- Copy: 404, page not found (AR/EN)
- Actions: Home, Services, Projects, Blog, Contact
- **Site search** via `GET /api/v1/search?q=`
- Suggested links from search results (posts, projects, services)

## 403 — `/[locale]/forbidden`

- Message: no permission
- Actions: Home + role-based dashboard (`getDefaultAdminPath`)

## Blog disabled

Visiting `/blog` when section off → Next.js `notFound()` (404).
