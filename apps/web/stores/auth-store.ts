"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/lib/api/interfaces/auth.service";

const ACCESS_COOKIE = "umq_access";

export function setAccessCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (!token) {
    document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${15 * 60}; SameSite=Lax`;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearSession: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, accessToken, refreshToken }) => {
        setAccessCookie(accessToken);
        set({ user, accessToken, refreshToken });
      },
      clearSession: () => {
        setAccessCookie(null);
        set({ user: null, accessToken: null, refreshToken: null });
      },
      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.permissions.includes("*")) return true;
        return user.permissions.includes(permission);
      },
    }),
    {
      name: "umq-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessCookie(state.accessToken);
        }
      },
    },
  ),
);
