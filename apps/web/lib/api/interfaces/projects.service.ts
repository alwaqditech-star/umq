import type { CrudService, Project } from "../types";

export type ProjectsService = CrudService<Project> & {
  getBySlug?(slug: string): Promise<Project>;
};
