"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { modalBackdrop, modalContent } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }[size];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            aria-label="Close dialog"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={cn(
              "relative z-10 w-full rounded-2xl border border-border bg-surface p-6 shadow-lg",
              sizeClass,
              className,
            )}
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-foreground"
                >
                  {title}
                </h2>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-foreground-muted transition-colors hover:bg-accent/10 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
