"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function FastNavLink({
  href,
  className,
  children,
  onNavigate,
  prefetch = true,
  matchPrefix = true,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
  prefetch?: boolean;
  /** When false, only exact pathname match (use for home). */
  matchPrefix?: boolean;
}) {
  const pathname = usePathname();
  const startNavigation = useUiStore((s) => s.startNavigation);
  const navPending = useUiStore((s) => s.navPending);
  const isActive =
    pathname === href || (matchPrefix && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-current={isActive ? "page" : undefined}
      className={cn(className, navPending && !isActive && "opacity-80")}
      onClick={() => {
        if (pathname !== href) {
          startNavigation();
        }
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}
