"use client";

import { Target, Eye, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { FadeUp } from "@/components/motion/fade-up";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";

const pillars = [
  {
    icon: Eye,
    ar: "الرؤية",
    en: "Vision",
    bodyAr: "أن نكون الشريك التقني الأعمق للمؤسسات في المنطقة.",
    bodyEn:
      "To be the deepest technology partner for organizations in the region.",
  },
  {
    icon: Target,
    ar: "المهمة",
    en: "Mission",
    bodyAr: "تمكين التحول الرقمي بمنتجات آمنة وقابلة للتوسع.",
    bodyEn: "Enable digital transformation with secure, scalable products.",
  },
  {
    icon: Sparkles,
    ar: "القيم",
    en: "Values",
    bodyAr: "الجودة، الشفافية، والابتكار المسؤول.",
    bodyEn: "Quality, transparency, and responsible innovation.",
  },
] as const;

export default function AboutPage() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const p = dict.pages;

  return (
    <>
      <PageHeader
        kicker={p.aboutKicker}
        title={p.aboutTitle}
        description={p.aboutDesc}
      />

      <div className="container-umq py-14 sm:py-20">
        <FadeUp>
          <p className="mx-auto max-w-3xl text-center text-lg text-foreground-muted">
            {locale === "ar"
              ? "نجمع بين استشارات المنتج، هندسة البرمجيات، والتشغيل — من الفكرة إلى الإنتاج."
              : "We combine product consulting, software engineering, and operations — from idea to production."}
          </p>
        </FadeUp>

        <StaggerList className="mt-14 grid gap-6 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, ar, en, bodyAr, bodyEn }) => (
            <StaggerItem key={ar}>
              <Card elevated hover className="h-full text-center sm:text-start">
                <div className="mx-auto inline-flex rounded-2xl border border-accent/25 bg-accent/10 p-4 text-accent sm:mx-0">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <h2 className="mt-5 text-xl font-semibold">
                  {locale === "ar" ? ar : en}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                  {locale === "ar" ? bodyAr : bodyEn}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </>
  );
}
