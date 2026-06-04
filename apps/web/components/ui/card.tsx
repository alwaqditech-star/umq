"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  elevated?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hover = false,
      elevated = false,
      padding = "md",
      children,
      ...props
    },
    ref,
  ) => {
    const inner = (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border/90 bg-surface shadow-sm transition-all duration-300",
          elevated && "card-elevated",
          hover &&
            "cursor-pointer hover:border-accent/35 hover:shadow-lg hover:ring-1 hover:ring-accent/15",
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
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
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
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
  );
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
