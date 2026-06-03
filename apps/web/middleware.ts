import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale, locales } from "@/lib/i18n/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
