"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-light shadow-md hover:bg-secondary hover:shadow-lg",
  secondary:
    "bg-accent/15 text-foreground border border-accent/30 hover:bg-accent/25",
  ghost: "bg-transparent text-foreground hover:bg-accent/10",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.div
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        className={cn(fullWidth && "w-full", "inline-flex")}
      >
        <button
          ref={ref}
          type={type}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-xl font-medium transition-all duration-200",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            "disabled:pointer-events-none disabled:opacity-50",
            variants[variant],
            sizes[size],
            className,
          )}
          disabled={isDisabled}
          aria-busy={loading}
          {...props}
        >
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {children}
        </button>
      </motion.div>
    );
  },
);

Button.displayName = "Button";
