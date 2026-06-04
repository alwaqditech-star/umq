import type { AuthService } from "./interfaces/auth.service";
import type { BlogService } from "./interfaces/blog.service";
import type { JobsService } from "./interfaces/jobs.service";
import type { ProjectsService } from "./interfaces/projects.service";
import type { ServicesCatalogService } from "./interfaces/services.service";
import type { UsersService } from "./interfaces/users.service";
import type { Application } from "./types";
import type { CrudService } from "./types";
import { mockAuthService } from "./mock/mockAuthService";
import { mockBlogService } from "./mock/mockBlogService";
import { mockJobsService } from "./mock/mockJobsService";
import { mockProjectsService } from "./mock/mockProjectsService";
import { mockServicesService } from "./mock/mockServicesService";
import { mockUsersService } from "./mock/mockUsersService";
import { httpApi } from "./http/httpApi";
import { apiFetch } from "./http/client";

export type ApiClient = {
  auth: AuthService;
  users: UsersService;
  projects: ProjectsService;
  blog: BlogService;
  jobs: JobsService;
  services: ServicesCatalogService;
  applications: CrudService<Application>;
};

function createMockApi(): ApiClient {
  return {
    auth: mockAuthService,
    users: mockUsersService,
    projects: mockProjectsService,
    blog: mockBlogService,
    jobs: mockJobsService,
    services: mockServicesService,
    applications: {
      async getAll() {
        return [];
      },
      async getById() {
        return null;
      },
      async create() {
        throw new Error("Not implemented in mock mode");
      },
      async update() {
        throw new Error("Not implemented in mock mode");
      },
      async delete() {
        throw new Error("Not implemented in mock mode");
      },
    },
  };
}

function resolveApiMode(): "http" | "mock" {
  const mode = process.env.NEXT_PUBLIC_API_MODE;
  if (mode === "mock") return "mock";
  if (mode === "http") return "http";
  if (process.env.NEXT_PUBLIC_API_URL) return "http";
  return "mock";
}

export const apiMode = resolveApiMode();

/**
 * Single entry point for all data access.
 * Set NEXT_PUBLIC_API_MODE=http and NEXT_PUBLIC_API_URL to use NestJS + MySQL.
 */
export const api: ApiClient =
  apiMode === "http" ? httpApi : createMockApi();

export { apiFetch };
