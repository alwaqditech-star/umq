import { isApiConnectionError } from "./http/client";

/** SSR/public pages: avoid 500 when NestJS is not running yet. */
export async function fetchPublicOrEmpty<T>(
  loader: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    if (isApiConnectionError(error)) {
      console.warn("[UMQ] API unavailable — using empty fallback for public page");
      return fallback;
    }
    throw error;
  }
}
