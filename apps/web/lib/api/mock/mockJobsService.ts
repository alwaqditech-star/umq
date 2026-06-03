import type { JobsService } from "../interfaces/jobs.service";
import { createMockCrud } from "./create-mock-crud";
import { mockApplications, mockJobs } from "@/mocks/jobs";
import { delay } from "@/lib/utils";

const jobsCrud = createMockCrud(mockJobs);
const applications = [...mockApplications];

export const mockJobsService: JobsService = {
  getAll: () => jobsCrud.getAll(),
  getById: (id) => jobsCrud.getById(id),
  create: (data) => jobsCrud.create(data),
  update: (id, data) => jobsCrud.update(id, data),
  delete: (id) => jobsCrud.delete(id),
  async getApplications(jobId?: string) {
    await delay(100);
    return jobId
      ? applications.filter((a) => a.jobId === jobId)
      : [...applications];
  },
  async getApplicationById(id: string) {
    await delay(100);
    return applications.find((a) => a.id === id) ?? null;
  },
};
