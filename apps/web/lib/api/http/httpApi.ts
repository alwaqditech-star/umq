import type { ApiClient } from "../index";
import { httpAuthService } from "./httpAuthService";
import { createHttpCrud } from "./httpCrud";
import type {
  Application,
  BlogPost,
  Job,
  Project,
  Role,
  Service,
  User,
} from "../types";
import { apiFetch } from "./client";

const usersCrud = createHttpCrud<User>("/users");

export const httpApi: ApiClient = {
  auth: httpAuthService,
  users: {
    ...usersCrud,
    getRoles: () => apiFetch<Role[]>("/roles", { auth: true }),
    getRoleById: (id: string) =>
      apiFetch<Role | null>(`/roles/${id}`, { auth: true }).catch(() => null),
  },
  projects: createHttpCrud<Project>("/admin/projects", "/projects"),
  blog: createHttpCrud<BlogPost>("/admin/blog/posts", "/blog/posts"),
  jobs: {
    ...createHttpCrud<Job>("/admin/jobs", "/jobs"),
    getApplications: (jobId?: string) => {
      const query = jobId ? `?jobId=${jobId}` : "";
      return apiFetch<Application[]>(`/admin/applications${query}`, {
        auth: true,
      });
    },
    getApplicationById: (id: string) =>
      apiFetch<Application>(`/admin/applications/${id}`, { auth: true }),
  },
  services: {
    ...createHttpCrud<Service>("/admin/services", "/services"),
    getTestimonials: async () => [],
  },
  applications: {
    async getAll() {
      return apiFetch<Application[]>("/admin/applications", { auth: true });
    },
    async getById(id: string) {
      return apiFetch<Application>(`/admin/applications/${id}`, { auth: true });
    },
    async create() {
      throw new Error("Applications are created via public job apply endpoint");
    },
    async update(id: string, data: { status?: string }) {
      if (!data.status) throw new Error("status is required");
      return apiFetch<Application>(`/admin/applications/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: data.status }),
      });
    },
    async delete() {
      throw new Error("Applications cannot be deleted");
    },
  },
};
