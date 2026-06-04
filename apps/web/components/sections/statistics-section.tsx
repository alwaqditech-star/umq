"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MeshBackground } from "@/components/design/mesh-background";
import type { Locale } from "@/stores/ui-store";

const stats = (locale: Locale) =>
  locale === "ar"
    ? [
        { value: "50+", label: "مشروع منجز" },
        { value: "15+", label: "قطاع" },
        { value: "99%", label: "رضا العملاء" },
        { value: "24/7", label: "دعم تشغيلي" },
      ]
    : [
        { value: "50+", label: "Projects delivered" },
        { value: "15+", label: "Industries" },
        { value: "99%", label: "Client satisfaction" },
        { value: "24/7", label: "Operations support" },
      ];

export function StatisticsSection({ locale }: { locale: Locale }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = stats(locale);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <MeshBackground variant="subtle" />
      <div ref={ref} className="container-umq relative">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="surface-premium rounded-2xl p-8 text-center"
            >
              <p className="text-3xl font-bold text-gradient sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
