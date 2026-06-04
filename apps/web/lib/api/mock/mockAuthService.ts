import type { AuthService, AuthUser, LoginCredentials } from "../interfaces/auth.service";
import { delay } from "@/lib/utils";

const MOCK_USER: AuthUser = {
  id: "1",
  email: "admin@umq.sa",
  name: "مدير النظام",
  role: "Super Admin",
  roleSlug: "super-admin",
  permissions: ["*"],
};

let session: AuthUser | null = null;

export const mockAuthService: AuthService = {
  async login(credentials: LoginCredentials) {
    await delay(200);
    if (
      credentials.email === "admin@umq.sa" &&
      credentials.password.length >= 6
    ) {
      session = MOCK_USER;
      return MOCK_USER;
    }
    throw new Error("Invalid credentials");
  },
  async logout() {
    await delay(80);
    session = null;
  },
  async getCurrentUser() {
    await delay(80);
    return session;
  },
};
