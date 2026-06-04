import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale, locales } from "@/lib/i18n/routes";

const PANEL_PREFIXES = ["/admin", "/editor"] as const;

function isPanelPath(path: string): boolean {
  return PANEL_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API proxy (/api/v1 → NestJS) must not get a locale prefix
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[0];
  const isLocale = localeSegment && isValidLocale(localeSegment);
  const restPath = isLocale ? `/${segments.slice(1).join("/")}` : pathname;

  if (isLocale && isPanelPath(restPath)) {
    const hasToken = request.cookies.get("umq_access")?.value;
    if (!hasToken) {
      return NextResponse.redirect(
        new URL(`/${localeSegment}/login`, request.url),
      );
    }
  }

  if (isLocale && restPath === "/login") {
    const hasToken = request.cookies.get("umq_access")?.value;
    if (hasToken) {
      const home = request.cookies.get("umq_admin_home")?.value ?? "/admin";
      const safeHome =
        home.startsWith("/admin") || home.startsWith("/editor")
          ? home
          : "/admin";
      return NextResponse.redirect(
        new URL(`/${localeSegment}${safeHome}`, request.url),
      );
    }
  }

  const segment = pathname.split("/")[1];
  if (segment && !isValidLocale(segment) && !pathname.startsWith("/_next")) {
    const hasLocalePrefix = locales.some((l) => pathname.startsWith(`/${l}`));
    if (!hasLocalePrefix && !pathname.includes(".")) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)"],
};
