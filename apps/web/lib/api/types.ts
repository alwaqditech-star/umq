export type EntityStatus = "active" | "inactive" | "draft" | "published";

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  roleSlug?: string;
  roleId?: string;
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
  contentAr?: string;
  contentEn?: string;
  icon: string;
  order?: number;
  featured?: boolean;
  status?: EntityStatus;
}

export interface BlogPost extends BaseEntity {
  slug: string;
  title?: string;
  content?: string;
  excerpt?: string;
  locale?: "ar" | "en";
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  category: string;
  categoryAr?: string;
  categoryEn?: string;
  categorySlug?: string;
  author: string;
  coverMediaId?: string | null;
  coverImageUrl?: string;
  coverAltAr?: string;
  coverAltEn?: string;
  tags?: string[];
  publishedAt: string;
  readingTime: number;
  status?: EntityStatus;
}

export interface Project extends BaseEntity {
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr?: string;
  contentEn?: string;
  clientName: string;
  technologies: string[];
  category: string;
  categoryId?: string | null;
  coverImageUrl?: string;
  featured?: boolean;
  order?: number;
  status?: EntityStatus;
}

export interface HomeSectionRow {
  id: string;
  key: string;
  labelAr: string;
  labelEn: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface SearchResults {
  services: {
    type: "service";
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string;
    summaryEn: string;
  }[];
  projects: {
    type: "project";
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string;
    summaryEn: string;
  }[];
  posts: {
    type: "post";
    slug: string;
    title: string;
    excerpt: string;
    coverImageUrl?: string;
    publishedAt: string;
  }[];
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
  status?: EntityStatus;
  applicationDeadline?: string;
}

export interface Application extends BaseEntity {
  jobId: string;
  applicantName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  notes?: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "hired";
  appliedAt: string;
  jobTitle?: string;
}

export interface Contact extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "closed";
}

export interface Category extends BaseEntity {
  slug: string;
  nameAr: string;
  nameEn: string;
  order?: number;
}

export interface Testimonial extends BaseEntity {
  authorAr: string;
  authorEn: string;
  companyAr: string;
  companyEn: string;
  contentAr: string;
  contentEn: string;
  rating: number;
  order?: number;
  status?: EntityStatus;
}

export type CreateInput<T extends BaseEntity> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateInput<T extends BaseEntity> = Partial<CreateInput<T>>;

export interface CrudService<T extends BaseEntity> {
  getAll(localeOrOptions?: string): Promise<T[]>;
  listAdmin?(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: CreateInput<T> | Record<string, unknown>): Promise<T>;
  update(
    id: string,
    data: UpdateInput<T> | Record<string, unknown>,
  ): Promise<T>;
  delete(id: string): Promise<void>;
}
