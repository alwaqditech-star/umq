import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "bg-chip text-chip",
  accent: "bg-accent/15 text-accent",
  success: "bg-emerald-500/15 text-emerald-700",
  warning: "bg-amber-500/15 text-amber-700",
  danger: "bg-red-500/15 text-red-700",
};

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
