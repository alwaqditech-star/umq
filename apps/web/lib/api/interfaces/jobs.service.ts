import type { Application, CrudService, Job } from "../types";

export interface JobsService extends CrudService<Job> {
  getApplications(jobId?: string): Promise<Application[]>;
  getApplicationById(id: string): Promise<Application | null>;
}
