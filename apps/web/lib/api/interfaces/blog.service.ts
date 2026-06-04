import type { BlogPost, CrudService } from "../types";

export type BlogService = CrudService<BlogPost> & {
  getBySlug?(slug: string, locale?: string): Promise<BlogPost>;
  getRelated?(slug: string, locale?: string): Promise<BlogPost[]>;
};
