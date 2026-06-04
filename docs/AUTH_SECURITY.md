# Phase 7 — Authentication & Security

## Implemented

### Tokens (no localStorage)
- `umq_access` — JWT, HttpOnly, SameSite=Strict, short-lived (default 15m)
- `umq_refresh` — opaque token, HttpOnly, rotation on every refresh
- Zustand persists **user profile only** (`umq-auth`), never tokens
- `umq_admin_home` — non-secret path hint for middleware (not HttpOnly)

### API (`/api/v1/auth`)
| Endpoint | Description |
|----------|-------------|
| `POST /login` | Sets cookies; `rememberMe` → 30d refresh |
| `POST /refresh` | Reads refresh cookie; rotates session |
| `POST /logout` | Revokes refresh; clears cookies |
| `GET /me` | Current user (JWT from cookie or Bearer) |
| `POST /forgot-password` | Reset token in DB; dev returns `resetUrl` |
| `POST /reset-password` | Policy + revoke all sessions |
| `POST /change-password` | Auth required; clears cookies after |
| `GET /sessions` | Active refresh tokens |
| `DELETE /sessions/:id` | Revoke one session |
| `POST /sessions/revoke-others` | Keep current device only |

### Account lockout
- After `AUTH_MAX_FAILED_LOGINS` (default 5) → `lockedUntil` for `AUTH_LOCKOUT_MINUTES` (default 15)

### Password policy (`@umq/shared`)
- Min 8 chars, upper, lower, digit

### Hardening
- `helmet`, `cookie-parser`, rate limiting (`@nestjs/throttler`)
- Stricter limits on login / forgot / reset

### Web
- Next.js rewrite: `/api/v1` → NestJS (`API_INTERNAL_URL`)
- Pages: login (remember me), forgot, **reset-password**, **admin/account** (change password + sessions)

## Environment

```env
NEXT_PUBLIC_API_URL=/api/v1
API_INTERNAL_URL=http://127.0.0.1:4000
WEB_ORIGIN=http://localhost:3000
AUTH_COOKIE_SECURE=false   # true in production behind HTTPS
JWT_REFRESH_REMEMBER_EXPIRES=30d
PASSWORD_RESET_EXPIRES=1h
AUTH_MAX_FAILED_LOGINS=5
AUTH_LOCKOUT_MINUTES=15
```

## Dev test flow

1. `pnpm dev` (API + Web + MySQL)
2. Login at `/ar/login` — cookies set on `localhost:3000`
3. Forgot password → copy `resetUrl` from response (dev only)
4. Admin → Account → change password / revoke sessions

## Not in Phase 7 (later)

- CSRF double-submit token (SameSite=Strict mitigates same-site)
- Email delivery for reset links (production)
- CSP tuning beyond Helmet defaults
