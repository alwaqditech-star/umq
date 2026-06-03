"use client";

import { useEffect } from "react";
import { getDirection } from "@/lib/i18n/routes";
import { useUiStore, type Locale } from "@/stores/ui-store";

export function LocaleSync({ locale }: { locale: Locale }) {
  const setLocale = useUiStore((s) => s.setLocale);
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    setLocale(locale);
    const html = document.documentElement;
    html.lang = locale;
    html.dir = getDirection(locale);
  }, [locale, setLocale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
