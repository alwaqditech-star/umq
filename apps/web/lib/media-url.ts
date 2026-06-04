/** Normalize API media URLs for Next.js Image (same-origin proxy). */
export function resolveMediaUrl(url?: string | null): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(trimmed);
    const match = parsed.pathname.match(/\/media\/files\/(.+)$/);
    if (match) {
      return `/api/v1/media/files/${match[1]}`;
    }
    return trimmed;
  } catch {
    return trimmed.startsWith("/") ? trimmed : trimmed;
  }
}
