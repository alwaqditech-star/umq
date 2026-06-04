export type EntityStatus = "active" | "inactive" | "draft" | "published";

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface Role extends BaseEntity {
  name: string;
  slug: string;
  usersCount: number;
  permissions: string[];
}

export interface Service extends BaseEntity {
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  icon: string;
  featured?: boolean;
}

export interface Project extends BaseEntity {
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  clientName: string;
  technologies: string[];
  category: string;
  featured?: boolean;
}

export interface BlogPost extends BaseEntity {
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
}

export interface Job extends BaseEntity {
  slug: string;
  titleAr: string;
  titleEn: string;
  department: string;
  location: string;
  type: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface Application extends BaseEntity {
  jobId: string;
  applicantName: string;
  email: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected";
  appliedAt: string;
  jobTitle?: string;
}

export interface Testimonial extends BaseEntity {
  authorAr: string;
  authorEn: string;
  companyAr: string;
  companyEn: string;
  contentAr: string;
  contentEn: string;
  rating: number;
}

export type CreateInput<T extends BaseEntity> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type UpdateInput<T extends BaseEntity> = Partial<CreateInput<T>>;

export interface CrudService<T extends BaseEntity> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: CreateInput<T>): Promise<T>;
  update(id: string, data: UpdateInput<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
