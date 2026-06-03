"use client";

import { useParams } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

/** Read locale from the URL segment — safe during SSR/prerender. */
export function useLocale(): Locale {
  const params = useParams();
  const value = params?.locale;

  if (typeof value === "string" && isValidLocale(value)) {
    return value;
  }

  return "ar";
}
