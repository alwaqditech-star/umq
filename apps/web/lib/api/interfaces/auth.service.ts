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
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
