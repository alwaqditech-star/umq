"use client";

import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-umq flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-gradient">{dict.brandFull}</p>
          <p className="mt-1 text-sm text-foreground-muted">{dict.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
          <Link href={localePath(locale, "/contact")} className="hover:text-accent">
            {dict.nav.contact}
          </Link>
          <span>{dict.footer.privacy}</span>
          <span>{dict.footer.terms}</span>
        </div>
        <p className="text-sm text-foreground-muted">
          © {year} {dict.brandFull}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
