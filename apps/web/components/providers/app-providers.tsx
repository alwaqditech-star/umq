"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/ui-store";
import { applyThemeToDocument, type ThemeMode } from "@/lib/theme";

export function AppProviders({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    const current = useUiStore.getState().theme || initialTheme;
    applyThemeToDocument(current);
  }, [initialTheme]);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return <>{children}</>;
}
