import type { BaseEntity, CrudService, CreateInput, UpdateInput } from "../types";
import { apiFetch } from "./client";

export function createHttpCrud<T extends BaseEntity>(
  adminPath: string,
  publicPath?: string,
): CrudService<T> {
  return {
    async getAll() {
      const path = publicPath ?? adminPath;
      return apiFetch<T[]>(path.startsWith("/") ? path : `/${path}`, {
        auth: !publicPath,
      });
    },
    async getById(id: string) {
      return apiFetch<T>(`${adminPath}/${id}`, { auth: true });
    },
    async create(data: CreateInput<T>) {
      return apiFetch<T>(adminPath, {
        method: "POST",
        auth: true,
        body: JSON.stringify(data),
      });
    },
    async update(id: string, data: UpdateInput<T>) {
      return apiFetch<T>(`${adminPath}/${id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(data),
      });
    },
    async delete(id: string) {
      await apiFetch(`${adminPath}/${id}`, {
        method: "DELETE",
        auth: true,
      });
    },
  };
}
