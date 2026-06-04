"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useSectionEnabled } from "@/providers/site-config-provider";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const links = [
  { key: "home", path: "", sectionKey: null },
  { key: "about", path: "/about", sectionKey: null },
  { key: "services", path: "/services", sectionKey: "services" },
  { key: "projects", path: "/projects", sectionKey: "projects" },
  { key: "blog", path: "/blog", sectionKey: "blog" },
  { key: "contact", path: "/contact", sectionKey: null },
];

type NavLink = (typeof links)[number];

export function Navbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const blogEnabled = useSectionEnabled("blog");
  const pathname = usePathname();
  const navLinks = links.filter(
    (l) => !l.sectionKey || (l.sectionKey === "blog" ? blogEnabled : true),
  );
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme, publicMenuOpen, togglePublicMenu, setPublicMenuOpen } =
    useUiStore();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent bg-surface/75 backdrop-blur-xl transition-all duration-300",
        scrolled && "nav-scrolled",
      )}
    >
      <div className="container-umq flex h-16 items-center justify-between gap-4">
        <Link
          href={localePath(locale, "")}
          className="text-xl font-bold tracking-tight text-gradient"
        >
          {dict.brand}
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ key, path }) => {
            const href = localePath(locale, path);
            const active =
              pathname === href ||
              (path !== "" && pathname.startsWith(href));
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {dict.nav[key as keyof typeof dict.nav]}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-foreground-muted transition-colors hover:bg-accent/10"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          <Link
            href={localePath(locale, "/contact")}
            className="hidden rounded-xl bg-primary px-4 py-2 text-xs font-medium text-light shadow-sm transition-all hover:bg-secondary hover:shadow-md sm:inline-block"
          >
            {dict.cta.contactUs}
          </Link>
          <Link
            href={switchPath}
            className="hidden rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent/40 md:inline-block"
          >
            {otherLocale === "ar" ? "العربية" : "EN"}
          </Link>
          <button
            type="button"
            className="rounded-xl p-2.5 text-foreground-muted transition-colors hover:bg-accent/10 lg:hidden"
            onClick={togglePublicMenu}
            aria-label={publicMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={publicMenuOpen}
          >
            {publicMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresenceMobileNav
        open={publicMenuOpen}
        locale={locale}
        pathname={pathname}
        navLinks={navLinks}
        onClose={() => setPublicMenuOpen(false)}
      />
    </header>
  );
}

function AnimatePresenceMobileNav({
  open,
  locale,
  pathname,
  navLinks,
  onClose,
}: {
  open: boolean;
  locale: Locale;
  pathname: string;
  navLinks: NavLink[];
  onClose: () => void;
}) {
  const dict = getDictionary(locale);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-t border-border bg-surface/95 backdrop-blur-lg lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map(({ key, path }, i) => {
              const href = localePath(locale, path);
              const active =
                pathname === href ||
                (path !== "" && pathname.startsWith(href));
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: locale === "ar" ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-accent/15 text-primary ring-1 ring-accent/20"
                        : "text-foreground-muted hover:bg-accent/10",
                    )}
                  >
                    {dict.nav[key as keyof typeof dict.nav]}
                  </Link>
                </motion.div>
              );
            })}
            <Link
              href={localePath(locale, "/contact")}
              onClick={onClose}
              className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-light"
            >
              {dict.cta.contactUs}
            </Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
