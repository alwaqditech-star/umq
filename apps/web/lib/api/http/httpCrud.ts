import type {
  BaseEntity,
  CrudService,
  CreateInput,
  UpdateInput,
} from "../types";
import { apiFetch } from "./client";

export function createHttpCrud<T extends BaseEntity>(
  adminPath: string,
  publicPath?: string,
): CrudService<T> {
  const admin = adminPath.startsWith("/") ? adminPath : `/${adminPath}`;
  const pub = publicPath
    ? publicPath.startsWith("/")
      ? publicPath
      : `/${publicPath}`
    : undefined;

  return {
    async getAll(locale?: string) {
      if (!pub) {
        return apiFetch<T[]>(admin, { auth: true });
      }
      const query = locale ? `?locale=${locale}` : "";
      return apiFetch<T[]>(`${pub}${query}`);
    },
    async listAdmin() {
      return apiFetch<T[]>(admin, { auth: true });
    },
    async getById(id: string) {
      return apiFetch<T>(`${admin}/${id}`, { auth: true });
    },
    async create(data: CreateInput<T> | Record<string, unknown>) {
      return apiFetch<T>(admin, {
        method: "POST",
        auth: true,
        body: JSON.stringify(data),
      });
    },
    async update(id: string, data: UpdateInput<T> | Record<string, unknown>) {
      return apiFetch<T>(`${admin}/${id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(data),
      });
    },
    async delete(id: string) {
      await apiFetch(`${admin}/${id}`, {
        method: "DELETE",
        auth: true,
      });
    },
  };
}
