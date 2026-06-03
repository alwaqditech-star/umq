/**
 * UMQ brand design tokens — single source of truth for the design system.
 */
export const colors = {
  primary: "#0F244D",
  secondary: "#2C516E",
  accent: "#488695",
  light: "#F4FAFB",
  muted: "#9ABFC4",
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-sans)",
    display: "var(--font-display)",
    arabic: "var(--font-arabic)",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1.1" }],
    "6xl": ["3.75rem", { lineHeight: "1.05" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgb(15 36 77 / 0.06)",
  md: "0 4px 12px rgb(15 36 77 / 0.08)",
  lg: "0 12px 32px rgb(15 36 77 / 0.12)",
  glow: "0 0 40px rgb(72 134 149 / 0.25)",
} as const;

export const motion = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  ease: [0.22, 1, 0.36, 1] as const,
} as const;
