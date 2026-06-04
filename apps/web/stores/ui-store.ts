import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "@/lib/theme";

export type Locale = "ar" | "en";

interface UiState {
  locale: Locale;
  theme: ThemeMode;
  publicMenuOpen: boolean;
  adminSidebarOpen: boolean;
  navPending: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  togglePublicMenu: () => void;
  setPublicMenuOpen: (open: boolean) => void;
  toggleAdminSidebar: () => void;
  setAdminSidebarOpen: (open: boolean) => void;
  startNavigation: () => void;
  endNavigation: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: "ar",
      theme: "light",
      publicMenuOpen: false,
      adminSidebarOpen: false,
      navPending: false,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      togglePublicMenu: () =>
        set((s) => ({ publicMenuOpen: !s.publicMenuOpen })),
      setPublicMenuOpen: (publicMenuOpen) => set({ publicMenuOpen }),
      toggleAdminSidebar: () =>
        set((s) => ({ adminSidebarOpen: !s.adminSidebarOpen })),
      setAdminSidebarOpen: (adminSidebarOpen) => set({ adminSidebarOpen }),
      startNavigation: () => set({ navPending: true }),
      endNavigation: () => set({ navPending: false }),
    }),
    {
      name: "umq-ui",
      partialize: (s) => ({ locale: s.locale, theme: s.theme }),
    },
  ),
);
