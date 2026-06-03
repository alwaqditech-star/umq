import type { CrudService, Service, Testimonial } from "../types";

export interface ServicesCatalogService extends CrudService<Service> {
  getTestimonials(): Promise<Testimonial[]>;
}
