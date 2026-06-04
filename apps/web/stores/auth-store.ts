"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getPostLoginPath } from "@umq/shared/rbac";
import type { AuthUser } from "@/lib/api/interfaces/auth.service";

const ADMIN_HOME_COOKIE = "umq_admin_home";

function setAdminHomeCookie(roleSlug: string | null) {
  if (typeof document === "undefined") return;
  if (!roleSlug) {
    document.cookie = `${ADMIN_HOME_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
    return;
  }
  const path = getPostLoginPath(roleSlug);
  document.cookie = `${ADMIN_HOME_COOKIE}=${encodeURIComponent(path)}; path=/; max-age=${7 * 86400}; SameSite=Strict`;
}

interface AuthState {
  user: AuthUser | null;
  /** True after admin/editor gate verified session once this tab. */
  sessionVerified: boolean;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  markSessionVerified: () => void;
  hasPermission: (permission: string) => boolean;
}

/** Tokens live in HttpOnly cookies only — never in localStorage. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionVerified: false,
      setUser: (user) => {
        setAdminHomeCookie(user?.roleSlug ?? null);
        set({ user, sessionVerified: user ? true : false });
      },
      clearSession: () => {
        setAdminHomeCookie(null);
        set({ user: null, sessionVerified: false });
      },
      markSessionVerified: () => set({ sessionVerified: true }),
      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.permissions.includes("*")) return true;
        return user.permissions.includes(permission);
      },
    }),
    {
      name: "umq-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
