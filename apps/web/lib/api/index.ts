import type { AuthService } from "./interfaces/auth.service";
import type { BlogService } from "./interfaces/blog.service";
import type { ProjectsService } from "./interfaces/projects.service";
import type { ServicesCatalogService } from "./interfaces/services.service";
import type { UsersService } from "./interfaces/users.service";
import type { Contact, SearchResults } from "./types";
import type { CrudService } from "./types";
import { httpApi } from "./http/httpApi";
import type { cmsApi, projectCategoriesApi } from "./http/httpCms";

type CategoryApi = typeof projectCategoriesApi;

export type ApiClient = {
  auth: AuthService;
  users: UsersService;
  projects: ProjectsService;
  blog: BlogService;
  services: ServicesCatalogService;
  contacts: CrudService<Contact>;
  categories: {
    projects: CategoryApi;
    blog: CategoryApi;
  };
  cms: typeof cmsApi;
  search: (q: string, locale?: string) => Promise<SearchResults>;
};

/** Single data layer — NestJS + MySQL only. Mock mode removed. */
export const api: ApiClient = httpApi;

export const apiMode = "http" as const;

export { apiFetch, ApiError } from "./http/client";
