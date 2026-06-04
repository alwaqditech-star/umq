"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function AuthLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-32 end-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 start-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link
            href={localePath(locale, "")}
            className="text-2xl font-bold text-gradient"
          >
            {dict.brandFull}
          </Link>
          <p className="mt-2 text-sm text-foreground-muted">{dict.tagline}</p>
        </div>
        <div className="glass rounded-3xl p-8 shadow-lg">{children}</div>
      </motion.div>
    </div>
  );
}
