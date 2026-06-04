import type { AuthService, LoginCredentials } from "../interfaces/auth.service";
import { apiFetch } from "./client";
import { useAuthStore } from "@/stores/auth-store";

export const httpAuthService: AuthService = {
  async login(credentials: LoginCredentials) {
    const data = await apiFetch<{
      accessToken: string;
      refreshToken: string;
      user: import("../interfaces/auth.service").AuthUser;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    useAuthStore.getState().setSession({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return data.user;
  },

  async logout() {
    const { refreshToken, clearSession } = useAuthStore.getState();
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // clear local session even if API fails
    }
    clearSession();
  },

  async getCurrentUser() {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) return null;

    try {
      const user = await apiFetch<import("../interfaces/auth.service").AuthUser>(
        "/auth/me",
        { auth: true },
      );
      useAuthStore.setState({ user });
      return user;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    }
  },
};
