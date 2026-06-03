/**
 * Future HTTP layer — connect to NestJS API without changing UI.
 *
 * Implementation checklist (Phase 2+):
 * - httpClient with base URL from NEXT_PUBLIC_API_URL
 * - JWT refresh interceptor
 * - Map REST endpoints to service interfaces
 *
 * Example switch in lib/api/index.ts:
 *   const mode = process.env.NEXT_PUBLIC_API_MODE;
 *   export const api = mode === "http" ? httpApi : mockApi;
 */

export const HTTP_API_NOT_IMPLEMENTED =
  "HTTP API layer is reserved for NestJS integration. Use mock mode.";

export function createHttpClient() {
  throw new Error(HTTP_API_NOT_IMPLEMENTED);
}
