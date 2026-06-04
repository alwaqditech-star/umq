import { useAuthStore } from "@/stores/auth-store";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setSession, clearSession } = useAuthStore.getState();
  if (!refreshToken) return null;

  const res = await fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearSession();
    return null;
  }

  const data = (await res.json()) as {
    accessToken: string;
    refreshToken: string;
    user: import("../interfaces/auth.service").AuthUser;
  };

  setSession({
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = false, headers, ...init } = options;
  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const buildHeaders = (token?: string | null): HeadersInit => ({
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
  });

  let token = auth ? useAuthStore.getState().accessToken : null;

  let response = await fetch(url, {
    ...init,
    headers: buildHeaders(token),
  });

  if (auth && response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...init,
        headers: buildHeaders(newToken),
      });
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.message === "string"
        ? body.message
        : Array.isArray(body.message)
          ? body.message.join(", ")
          : `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { baseUrl };
