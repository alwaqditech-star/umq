export interface JwtPayload {
  sub: string;
  email: string;
  roleSlug: string;
  permissions: string[];
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  roleSlug: string;
  permissions: string[];
}
