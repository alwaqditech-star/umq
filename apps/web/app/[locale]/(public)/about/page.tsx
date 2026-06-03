"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/use-locale";

export default function AboutPage() {
  const locale = useLocale();

  return (
    <div className="container-umq py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold">
          {locale === "ar" ? "من نحن" : "About Us"}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground-muted">
          {locale === "ar"
            ? "عُمْق لتقنية المعلومات شركة سعودية متخصصة في بناء المنصات الرقمية والحلول المؤسسية. نجمع بين العمق الاستراتيجي والتنفيذ التقني بمعايير عالمية."
            : "UMQ Information Technology is a Saudi company specializing in digital platforms and enterprise solutions — combining strategic depth with world-class engineering."}
        </p>
      </FadeUp>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          {
            ar: "الرؤية",
            en: "Vision",
            bodyAr: "أن نكون الشريك التقني الأعمق للمؤسسات في المنطقة.",
            bodyEn: "To be the deepest technology partner for organizations in the region.",
          },
          {
            ar: "المهمة",
            en: "Mission",
            bodyAr: "تمكين التحول الرقمي بمنتجات آمنة وقابلة للتوسع.",
            bodyEn: "Enable digital transformation with secure, scalable products.",
          },
          {
            ar: "القيم",
            en: "Values",
            bodyAr: "الجودة، الشفافية، والابتكار المسؤول.",
            bodyEn: "Quality, transparency, and responsible innovation.",
          },
        ].map((item) => (
          <Card key={item.ar}>
            <h2 className="text-xl font-semibold">
              {locale === "ar" ? item.ar : item.en}
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              {locale === "ar" ? item.bodyAr : item.bodyEn}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
