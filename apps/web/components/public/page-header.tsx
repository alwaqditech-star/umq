"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  description,
  className,
  centered = false,
}: {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/80 bg-surface/40",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-20 start-1/3 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 end-0 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />

      <div className="container-umq relative py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={cn("max-w-3xl", centered && "mx-auto text-center")}
        >
          {kicker && <span className="section-kicker">{kicker}</span>}
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient">{title}</span>
          </h1>
          {description && (
            <p className="mt-5 text-lg text-foreground-muted sm:text-xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
      <div className="footer-gradient-top h-px w-full opacity-60" aria-hidden />
    </section>
  );
}
