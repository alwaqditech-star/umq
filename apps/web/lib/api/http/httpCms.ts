import { apiFetch, apiUpload } from "./client";
import { createHttpCrud } from "./httpCrud";
import type { Category, Testimonial } from "../types";

const testimonialsCrud = createHttpCrud<Testimonial>(
  "/admin/testimonials",
  "/testimonials",
);

export const projectCategoriesApi = {
  list: () => apiFetch<Category[]>("/admin/project-categories", { auth: true }),
  create: (data: Omit<Category, "id">) =>
    apiFetch<Category>("/admin/project-categories", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Category>) =>
    apiFetch<Category>(`/admin/project-categories/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`/admin/project-categories/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const blogCategoriesApi = {
  list: () => apiFetch<Category[]>("/admin/blog-categories", { auth: true }),
  create: (data: Omit<Category, "id">) =>
    apiFetch<Category>("/admin/blog-categories", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Category>) =>
    apiFetch<Category>(`/admin/blog-categories/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`/admin/blog-categories/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const cmsApi = {
  testimonials: {
    ...testimonialsCrud,
    listAdmin: () => testimonialsCrud.listAdmin!(),
  },
  team: createHttpCrud("/admin/team-members", "/team-members"),
  partners: createHttpCrud("/admin/partners", "/partners"),
  settings: {
    list: () =>
      apiFetch<{ key: string; value: unknown; group: string }[]>(
        "/admin/settings",
        { auth: true },
      ),
    upsert: (key: string, value: unknown, group?: string) =>
      apiFetch("/admin/settings", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ key, value, group }),
      }),
  },
  homeSections: {
    list: () =>
      apiFetch<
        {
          id: string;
          key: string;
          labelAr: string;
          labelEn: string;
          isEnabled: boolean;
          sortOrder: number;
        }[]
      >("/admin/website-sections", { auth: true }),
    update: (
      id: string,
      data: Partial<{
        labelAr: string;
        labelEn: string;
        isEnabled: boolean;
        sortOrder: number;
      }>,
    ) =>
      apiFetch(`/admin/website-sections/${id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(data),
      }),
    reorder: (items: { id: string; sortOrder: number }[]) =>
      apiFetch("/admin/website-sections/reorder", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ items }),
      }),
  },
  sections: {
    list: () =>
      apiFetch<unknown[]>("/admin/website-sections/content", { auth: true }),
    upsert: (data: Record<string, unknown>) =>
      apiFetch("/admin/website-sections/content", {
        method: "POST",
        auth: true,
        body: JSON.stringify(data),
      }),
  },
  seo: {
    list: () => apiFetch<unknown[]>("/admin/seo-pages", { auth: true }),
    upsert: (data: Record<string, unknown>) =>
      apiFetch("/admin/seo-pages", {
        method: "POST",
        auth: true,
        body: JSON.stringify(data),
      }),
  },
  media: {
    list: () =>
      apiFetch<
        {
          id: string;
          filename: string;
          url: string;
          mimeType: string;
          size: number;
          folder: string;
          createdAt: string;
        }[]
      >("/admin/media", { auth: true }),
    upload: (formData: FormData) =>
      apiUpload<{
        id: string;
        url: string;
        filename: string;
      }>("/admin/media/upload", formData),
    delete: (id: string) =>
      apiFetch(`/admin/media/${id}`, { method: "DELETE", auth: true }),
  },
  auditLogs: (limit = 50) =>
    apiFetch<unknown[]>(`/admin/audit-logs?limit=${limit}`, { auth: true }),
  dashboardStats: () =>
    apiFetch<Record<string, number>>("/admin/dashboard/stats", { auth: true }),
};
