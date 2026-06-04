"use client";

import { cn } from "@/lib/utils";

export function MeshBackground({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "hero" | "subtle";
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "mesh-glow-a absolute -top-1/4 start-0 h-[520px] w-[520px] rounded-full blur-[100px]",
          variant === "hero" ? "bg-accent/25" : "bg-accent/15",
        )}
      />
      <div
        className={cn(
          "mesh-glow-b absolute top-1/3 end-0 h-[420px] w-[420px] rounded-full blur-[90px]",
          variant === "subtle" ? "bg-primary/8" : "bg-primary/12",
        )}
      />
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      {variant === "hero" && (
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      )}
    </div>
  );
}
