"use client";

import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex gap-1 rounded-xl border border-border bg-subtle p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-surface font-semibold text-nav-active shadow-sm"
                : "text-foreground-muted hover:text-foreground hover:bg-accent/5",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
