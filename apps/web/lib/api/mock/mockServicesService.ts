import type { ServicesCatalogService } from "../interfaces/services.service";
import { createMockCrud } from "./create-mock-crud";
import { mockServices, mockTestimonials } from "@/mocks/services";
import { delay } from "@/lib/utils";

const servicesCrud = createMockCrud(mockServices);

export const mockServicesService: ServicesCatalogService = {
  getAll: () => servicesCrud.getAll(),
  getById: (id) => servicesCrud.getById(id),
  create: (data) => servicesCrud.create(data),
  update: (id, data) => servicesCrud.update(id, data),
  delete: (id) => servicesCrud.delete(id),
  async getTestimonials() {
    await delay(100);
    return [...mockTestimonials];
  },
};
