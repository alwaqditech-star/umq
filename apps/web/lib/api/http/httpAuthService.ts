import type { AuthService, LoginCredentials } from "../interfaces/auth.service";
import { apiFetch, isApiConnectionError } from "./client";
import { useAuthStore } from "@/stores/auth-store";

export const httpAuthService: AuthService = {
  async login(credentials: LoginCredentials) {
    try {
      const data = await apiFetch<{
        user: import("../interfaces/auth.service").AuthUser;
        expiresIn?: number;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      useAuthStore.getState().setUser(data.user);
      return data.user;
    } catch (error) {
      if (isApiConnectionError(error)) {
        throw new Error(
          "Cannot reach API server. Start it with: pnpm --filter @umq/api dev",
        );
      }
      throw error;
    }
  },

  async logout() {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        auth: true,
        body: JSON.stringify({}),
      });
    } catch {
      // clear local session even if API fails
    }
    useAuthStore.getState().clearSession();
  },

  async forgotPassword(email: string) {
    return apiFetch<{ message: string; resetUrl?: string }>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
    );
  },

  async resetPassword(token: string, newPassword: string) {
    return apiFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const result = await apiFetch<{ message: string }>(
      "/auth/change-password",
      {
        method: "POST",
        auth: true,
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );
    useAuthStore.getState().clearSession();
    return result;
  },

  async getCurrentUser() {
    try {
      const user = await apiFetch<
        import("../interfaces/auth.service").AuthUser
      >("/auth/me", { auth: true });
      useAuthStore.getState().setUser(user);
      return user;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    }
  },

  async listSessions() {
    return apiFetch<
      {
        id: string;
        createdAt: string;
        expiresAt: string;
        userAgent: string | null;
        ipAddress: string | null;
        current: boolean;
      }[]
    >("/auth/sessions", { auth: true });
  },

  async revokeSession(sessionId: string) {
    await apiFetch(`/auth/sessions/${sessionId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  async revokeOtherSessions() {
    await apiFetch("/auth/sessions/revoke-others", {
      method: "POST",
      auth: true,
    });
  },
};
