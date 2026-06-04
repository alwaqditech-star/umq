import { ApiError, isApiConnectionError } from "./http/client";

/** SSR/public pages: never 500 when API is down or misconfigured (e.g. Vercel without backend). */
export async function fetchPublicOrEmpty<T>(
  loader: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    const reason =
      error instanceof ApiError
        ? `HTTP ${error.status}`
        : isApiConnectionError(error)
          ? "connection refused"
          : error instanceof Error
            ? error.message
            : "unknown";
    console.warn(`[UMQ] Public fetch failed (${reason}) — using fallback`);
    return fallback;
  }
}
