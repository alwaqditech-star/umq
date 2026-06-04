import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private parseTechnologies(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
    return [];
  }

  private mapProject(project: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string | null;
    summaryEn: string | null;
    clientName: string | null;
    technologies: unknown;
    featured: boolean;
    category: { nameAr: string; nameEn: string } | null;
  }) {
    return {
      id: project.id,
      slug: project.slug,
      titleAr: project.titleAr,
      titleEn: project.titleEn,
      summaryAr: project.summaryAr ?? "",
      summaryEn: project.summaryEn ?? "",
      clientName: project.clientName ?? "",
      technologies: this.parseTechnologies(project.technologies),
      category: project.category?.nameAr ?? "",
      featured: project.featured,
    };
  }

  async findPublished(category?: string) {
    const items = await this.prisma.project.findMany({
      where: {
        deletedAt: null,
        status: ContentStatus.PUBLISHED,
        ...(category
          ? { category: { slug: category, deletedAt: null } }
          : {}),
      },
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return items.map((p) => this.mapProject(p));
  }

  async findPublishedBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, deletedAt: null, status: ContentStatus.PUBLISHED },
      include: { category: true },
    });
    if (!project) throw new NotFoundException("Project not found");
    return this.mapProject(project);
  }

  async findAllAdmin() {
    const items = await this.prisma.project.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return items.map((p) => this.mapProject(p));
  }
}
