"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = "md", children, ...props }, ref) => {
    const inner = (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-surface shadow-sm",
          hover &&
            "cursor-pointer transition-shadow hover:border-accent/30 hover:shadow-lg",
          paddingMap[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );

    if (!hover) return inner;

    return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        {inner}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-foreground-muted", className)} {...props} />
  );
}
