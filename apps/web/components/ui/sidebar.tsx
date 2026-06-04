"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import type { AdminNavItem } from "@/lib/admin/nav-config";
import { AnimatePresence, motion } from "framer-motion";

type SidebarProps = {
  locale: Locale;
  homeHref: string;
  navItems: AdminNavItem[];
  labels: Record<string, string>;
  panelLabel: string;
};

export function Sidebar({
  locale,
  homeHref,
  navItems,
  labels,
  panelLabel,
}: SidebarProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { adminSidebarOpen, setAdminSidebarOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);

  const content = (
    <aside className="flex h-full w-64 flex-col border-e border-border bg-surface">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link
          href={localePath(locale, homeHref)}
          className="text-lg font-bold text-gradient"
        >
          {dict.brand}
        </Link>
        <button
          type="button"
          className="rounded-lg p-1.5 lg:hidden"
          onClick={() => setAdminSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {user && (
        <div className="border-b border-border px-4 py-3 text-xs text-foreground-muted">
          <p className="font-medium text-foreground">{user.name}</p>
          <p>{user.role}</p>
        </div>
      )}
      <nav className="flex-1 space-y-1 p-3" aria-label={panelLabel}>
        {navItems.map(({ key, href, icon: Icon }) => {
          const path = localePath(locale, href);
          const active =
            pathname === path ||
            (href !== homeHref && pathname.startsWith(path));
          const isDashboard = href === homeHref;
          return (
            <FastNavLink
              key={key}
              href={path}
              matchPrefix={!isDashboard}
              prefetch
              onNavigate={() => setAdminSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent/15 font-semibold text-nav-active shadow-sm"
                  : "text-foreground-muted hover:bg-accent/5 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {labels[key] ?? key}
            </FastNavLink>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-xs text-foreground-muted">
        UMQ · MySQL
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64">
        {content}
      </div>
      <AnimatePresence>
        {adminSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-primary/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdminSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 start-0 z-50 lg:hidden"
              initial={{ x: locale === "ar" ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? 280 : -280 }}
              transition={{ duration: 0.25 }}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
