"use client";

import Link from "next/link";
import { Globe, Mail, MapPin } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useSectionEnabled, useSiteConfig } from "@/providers/site-config-provider";
import type { Locale } from "@/stores/ui-store";

const exploreLinks = [
  { key: "home" as const, path: "", sectionKey: null },
  { key: "about" as const, path: "/about", sectionKey: null },
  { key: "services" as const, path: "/services", sectionKey: "services" },
  { key: "projects" as const, path: "/projects", sectionKey: "projects" },
  { key: "blog" as const, path: "/blog", sectionKey: "blog" },
] as const;

const companyLinks = [
  { key: "contact" as const, path: "/contact" },
] as const;

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { contact } = useSiteConfig();
  const blogEnabled = useSectionEnabled("blog");
  const year = new Date().getFullYear();
  const f = dict.footer;
  const visibleExplore = exploreLinks.filter(
    (l) => !l.sectionKey || (l.sectionKey === "blog" ? blogEnabled : true),
  );

  return (
    <footer className="relative mt-auto border-t border-border bg-surface">
      <div className="footer-gradient-top absolute inset-x-0 top-0 h-px" aria-hidden />

      <div className="container-umq py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link
              href={localePath(locale, "")}
              className="inline-block text-2xl font-bold tracking-tight text-gradient"
            >
              {dict.brand}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground-muted">
              {f.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground-muted transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground-muted transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                aria-label="LinkedIn"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-foreground-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              {locale === "ar" ? contact.addressAr : contact.addressEn}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {f.explore}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {visibleExplore.map(({ key, path }) => (
                  <li key={key}>
                    <Link
                      href={localePath(locale, path)}
                      className="text-sm text-foreground-muted transition-colors hover:text-accent"
                    >
                      {dict.nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {f.company}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map(({ key, path }) => (
                  <li key={key}>
                    <Link
                      href={localePath(locale, path)}
                      className="text-sm text-foreground-muted transition-colors hover:text-accent"
                    >
                      {dict.nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {f.connect}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground-muted">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-accent"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-accent"
                  >
                    {contact.phone}
                  </a>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 p-4">
                <p className="text-xs font-medium text-foreground">{f.newsletter}</p>
                <p className="mt-1 text-xs text-foreground-muted">{f.newsletterHint}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground-muted">
            © {year} {dict.brandFull}. {f.rights}
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-foreground-muted">
            <span className="cursor-default opacity-70">{f.privacy}</span>
            <span className="cursor-default opacity-70">{f.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
