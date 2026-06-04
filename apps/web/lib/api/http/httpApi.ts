import type { ApiClient } from "../index";
import { httpAuthService } from "./httpAuthService";
import { createHttpCrud } from "./httpCrud";
import { apiFetch, getBaseUrl } from "./client";
import {
  blogCategoriesApi,
  cmsApi,
  projectCategoriesApi,
} from "./httpCms";
import type {
  BlogPost,
  Contact,
  Project,
  Role,
  SearchResults,
  Service,
  Testimonial,
  User,
} from "../types";

const usersCrud = createHttpCrud<User>("/users");
const servicesCrud = createHttpCrud<Service>("/admin/services", "/services");
const projectsCrud = createHttpCrud<Project>("/admin/projects", "/projects");
const blogCrud = createHttpCrud<BlogPost>("/admin/blog/posts", "/blog/posts");

function publicBySlug<T>(base: string, slug: string, locale?: string) {
  const query = locale ? `?locale=${locale}` : "";
  return apiFetch<T>(`${base}/${slug}${query}`);
}

export const httpApi: ApiClient = {
  auth: httpAuthService,
  users: {
    getAll: () => usersCrud.listAdmin!(),
    listAdmin: () => usersCrud.listAdmin!(),
    getById: (id) => usersCrud.getById(id),
    create: (data) => usersCrud.create(data),
    update: (id, data) => usersCrud.update(id, data),
    delete: (id) => usersCrud.delete(id),
    getRoles: () => apiFetch<Role[]>("/roles", { auth: true }),
    getRoleById: (id: string) =>
      apiFetch<Role | null>(`/roles/${id}`, { auth: true }).catch(() => null),
  },
  services: {
    ...servicesCrud,
    getAll: (locale?: string) => servicesCrud.getAll(locale),
    getTestimonials: () => apiFetch<Testimonial[]>("/testimonials"),
  },
  projects: {
    ...projectsCrud,
    getAll: (locale?: string) => projectsCrud.getAll(locale),
    getBySlug: (slug: string) => publicBySlug<Project>("/projects", slug),
  },
  blog: {
    ...blogCrud,
    getAll: (locale?: string) => blogCrud.getAll(locale),
    getBySlug: (slug: string, locale?: string) =>
      publicBySlug<BlogPost>("/blog/posts", slug, locale),
    getRelated: (slug: string, locale?: string) =>
      apiFetch<BlogPost[]>(
        `/blog/posts/${slug}/related?locale=${locale ?? "ar"}`,
      ),
  },
  search: (q: string, locale?: string) =>
    apiFetch<SearchResults>(
      `/search?q=${encodeURIComponent(q)}&locale=${locale ?? "ar"}`,
    ),
  contacts: {
    getAll: () => apiFetch<Contact[]>("/admin/contacts", { auth: true }),
    listAdmin: () => apiFetch<Contact[]>("/admin/contacts", { auth: true }),
    getById: (id: string) =>
      apiFetch<Contact>(`/admin/contacts/${id}`, { auth: true }),
    create: async () => {
      throw new Error("Contacts are created from the public form");
    },
    update: (id, data) =>
      apiFetch<Contact>(`/admin/contacts/${id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(data),
      }),
    delete: async () => {
      throw new Error("Contacts cannot be deleted");
    },
  },
  categories: {
    projects: projectCategoriesApi,
    blog: blogCategoriesApi,
  },
  cms: cmsApi,
};

export { getBaseUrl };
