import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapService(service: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string | null;
    summaryEn: string | null;
    icon: string | null;
    featured: boolean;
    status: ContentStatus;
  }) {
    return {
      id: service.id,
      slug: service.slug,
      titleAr: service.titleAr,
      titleEn: service.titleEn,
      summaryAr: service.summaryAr ?? "",
      summaryEn: service.summaryEn ?? "",
      icon: service.icon ?? "layers",
      featured: service.featured,
      status:
        service.status === "PUBLISHED"
          ? ("published" as const)
          : service.status === "DRAFT"
            ? ("draft" as const)
            : ("inactive" as const),
    };
  }

  async findPublished() {
    const items = await this.prisma.service.findMany({
      where: { deletedAt: null, status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return items.map((s) => this.mapService(s));
  }

  async findPublishedBySlug(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: { slug, deletedAt: null, status: ContentStatus.PUBLISHED },
    });
    if (!service) throw new NotFoundException("Service not found");
    return this.mapService(service);
  }

  async findAllAdmin() {
    const items = await this.prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return items.map((s) => this.mapService(s));
  }

  async createAdmin(data: {
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr?: string;
    summaryEn?: string;
    icon?: string;
    status?: ContentStatus;
  }) {
    const service = await this.prisma.service.create({ data });
    return this.mapService(service);
  }

  async updateAdmin(
    id: string,
    data: Partial<{
      slug: string;
      titleAr: string;
      titleEn: string;
      summaryAr: string;
      summaryEn: string;
      icon: string;
      status: ContentStatus;
    }>,
  ) {
    const service = await this.prisma.service.update({ where: { id }, data });
    return this.mapService(service);
  }

  async removeAdmin(id: string) {
    await this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: "Service deleted successfully" };
  }
}
