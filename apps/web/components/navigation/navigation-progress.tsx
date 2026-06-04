"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUiStore } from "@/stores/ui-store";

/** Top bar — shows immediately on nav click, hides when the route updates. */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navPending = useUiStore((s) => s.navPending);
  const endNavigation = useUiStore((s) => s.endNavigation);

  useEffect(() => {
    endNavigation();
  }, [pathname, searchParams, endNavigation]);

  useEffect(() => {
    if (!navPending) return;
    document.documentElement.classList.add("nav-is-pending");
    return () => document.documentElement.classList.remove("nav-is-pending");
  }, [navPending]);

  if (!navPending) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-accent/20"
      role="progressbar"
      aria-label="Loading page"
    >
      <div className="h-full w-2/5 animate-[nav-progress_0.7s_ease-in-out_infinite] rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
    </div>
  );
}
