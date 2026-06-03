"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const links = [
  { key: "home", path: "" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "projects", path: "/projects" },
  { key: "blog", path: "/blog" },
  { key: "careers", path: "/careers" },
  { key: "contact", path: "/contact" },
] as const;

export function Navbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { theme, toggleTheme, publicMenuOpen, togglePublicMenu, setPublicMenuOpen } =
    useUiStore();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
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
          {links.map(({ key, path }) => {
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
                {dict.nav[key]}
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
            href={switchPath}
            className="hidden rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent/40 sm:inline-block"
          >
            {otherLocale === "ar" ? "العربية" : "EN"}
          </Link>
          <Link href={localePath(locale, "/admin")} className="hidden sm:block">
            <Button variant="ghost" size="sm">
              {dict.nav.admin}
            </Button>
          </Link>
          <Link
            href={localePath(locale, "/login")}
            className="hidden sm:block"
          >
            <Button size="sm">{dict.nav.login}</Button>
          </Link>
          <button
            type="button"
            className="rounded-xl p-2.5 lg:hidden"
            onClick={togglePublicMenu}
            aria-label="Open menu"
            aria-expanded={publicMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresenceMobileNav
        open={publicMenuOpen}
        locale={locale}
        pathname={pathname}
        onClose={() => setPublicMenuOpen(false)}
      />
    </header>
  );
}

function AnimatePresenceMobileNav({
  open,
  locale,
  pathname,
  onClose,
}: {
  open: boolean;
  locale: Locale;
  pathname: string;
  onClose: () => void;
}) {
  const dict = getDictionary(locale);
  if (!open) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-border bg-surface lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex flex-col gap-1 p-4">
        {links.map(({ key, path }) => {
          const href = localePath(locale, path);
          return (
            <Link
              key={key}
              href={href}
              onClick={onClose}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium",
                pathname === href
                  ? "bg-accent/15 text-primary"
                  : "text-foreground-muted",
              )}
            >
              {dict.nav[key]}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
