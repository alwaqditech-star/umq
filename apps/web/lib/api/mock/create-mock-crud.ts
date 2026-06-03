import type { BaseEntity, CreateInput, CrudService, UpdateInput } from "../types";
import { delay } from "@/lib/utils";

export function createMockCrud<T extends BaseEntity>(
  initial: T[],
  latencyMs = 120,
): CrudService<T> & { _data: T[] } {
  let data = [...initial];

  return {
    _data: data,
    async getAll() {
      await delay(latencyMs);
      return [...data];
    },
    async getById(id: string) {
      await delay(latencyMs);
      return data.find((item) => item.id === id) ?? null;
    },
    async create(input: CreateInput<T>) {
      await delay(latencyMs);
      const item = {
        ...input,
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `id-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      data = [item, ...data];
      return item;
    },
    async update(id: string, input: UpdateInput<T>) {
      await delay(latencyMs);
      const index = data.findIndex((item) => item.id === id);
      if (index === -1) throw new Error(`Entity ${id} not found`);
      const updated = {
        ...data[index],
        ...input,
        updatedAt: new Date().toISOString(),
      } as T;
      data[index] = updated;
      return updated;
    },
    async delete(id: string) {
      await delay(latencyMs);
      data = data.filter((item) => item.id !== id);
    },
  };
}
