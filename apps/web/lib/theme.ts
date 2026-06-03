import { colors } from "./design-tokens";

export type ThemeMode = "light" | "dark";

export const lightTheme = {
  mode: "light" as const,
  background: colors.light,
  surface: "#FFFFFF",
  foreground: colors.primary,
  foregroundMuted: colors.secondary,
  border: "rgb(154 191 196 / 0.45)",
};

export const darkTheme = {
  mode: "dark" as const,
  background: "#0A1628",
  surface: colors.primary,
  foreground: colors.light,
  foregroundMuted: colors.muted,
  border: "rgb(72 134 149 / 0.25)",
};

/** Sync theme via data-theme attribute (see globals.css) */
export function applyThemeToDocument(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", mode);
}
