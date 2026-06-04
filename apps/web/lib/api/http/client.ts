import { useAuthStore } from "@/stores/auth-store";
import { PUBLIC_PAGE_REVALIDATE } from "@/lib/public-cache";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function normalizePublicApiPath(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() || "/api/v1";
  const trimmed = raw.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** Browser: same-origin absolute URL. Server: direct NestJS URL. */
export function getBaseUrl(): string {
  if (typeof window === "undefined") {
    const internal = (
      process.env.API_INTERNAL_URL ??
      `http://127.0.0.1:${process.env.API_PORT ?? "4001"}`
    ).replace(/\/$/, "");
    return `${internal}/api/v1`;
  }
  const path = normalizePublicApiPath();
  if (path.startsWith("http")) return path;
  return new URL(path, window.location.origin).href;
}

export function isApiConnectionError(error: unknown): boolean {
  if (!(error instanceof TypeError) || error.message !== "fetch failed") {
    return false;
  }
  const cause = (error as { cause?: { code?: string } }).cause;
  return (
    cause?.code === "ECONNREFUSED" ||
    cause?.code === "ENOTFOUND" ||
    cause?.code === "ECONNRESET"
  );
}

async function refreshSession(): Promise<boolean> {
  const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    useAuthStore.getState().clearSession();
    return false;
  }

  const data = (await res.json()) as {
    user: import("../interfaces/auth.service").AuthUser;
  };
  useAuthStore.getState().setUser(data.user);
  return true;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = false, headers, ...init } = options;
  const url = path.startsWith("http")
    ? path
    : `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const buildHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  });

  const serverCache =
    typeof window === "undefined" && !auth
      ? { next: { revalidate: PUBLIC_PAGE_REVALIDATE } }
      : {};

  let response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: buildHeaders(),
    ...serverCache,
  });

  if (auth && response.status === 401) {
    const refreshed = await refreshSession();
    if (refreshed) {
      response = await fetch(url, {
        ...init,
        credentials: "include",
        headers: buildHeaders(),
        ...serverCache,
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

/** Multipart upload (no JSON Content-Type). */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.message === "string"
        ? body.message
        : `Upload failed (${response.status})`;
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

export { getBaseUrl as baseUrl };
