import type { EntityStatus } from "@/lib/api/types";

export function parseContentStatus(value: string): EntityStatus {
  if (value === "published" || value === "draft" || value === "inactive") {
    return value;
  }
  return "draft";
}
