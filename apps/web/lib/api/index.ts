import type { AuthService } from "./interfaces/auth.service";
import type { BlogService } from "./interfaces/blog.service";
import type { JobsService } from "./interfaces/jobs.service";
import type { ProjectsService } from "./interfaces/projects.service";
import type { ServicesCatalogService } from "./interfaces/services.service";
import type { UsersService } from "./interfaces/users.service";
import { mockAuthService } from "./mock/mockAuthService";
import { mockBlogService } from "./mock/mockBlogService";
import { mockJobsService } from "./mock/mockJobsService";
import { mockProjectsService } from "./mock/mockProjectsService";
import { mockServicesService } from "./mock/mockServicesService";
import { mockUsersService } from "./mock/mockUsersService";

export type ApiClient = {
  auth: AuthService;
  users: UsersService;
  projects: ProjectsService;
  blog: BlogService;
  jobs: JobsService;
  services: ServicesCatalogService;
};

function createMockApi(): ApiClient {
  return {
    auth: mockAuthService,
    users: mockUsersService,
    projects: mockProjectsService,
    blog: mockBlogService,
    jobs: mockJobsService,
    services: mockServicesService,
  };
}

/**
 * Single entry point for all data access.
 * UI must import `api` only — never mock files directly.
 */
export const api: ApiClient = createMockApi();
