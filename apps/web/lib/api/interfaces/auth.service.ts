export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roleSlug: string;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string | null;
  ipAddress: string | null;
  current: boolean;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  forgotPassword(
    email: string,
  ): Promise<{ message: string; resetUrl?: string }>;
  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }>;
  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }>;
  listSessions(): Promise<AuthSession[]>;
  revokeSession(sessionId: string): Promise<void>;
  revokeOtherSessions(): Promise<void>;
}
