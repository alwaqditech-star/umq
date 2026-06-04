import { Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus, ContentStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapJob(job: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    location: string | null;
    employmentType: string | null;
    category: { nameAr: string } | null;
  }) {
    return {
      id: job.id,
      slug: job.slug,
      titleAr: job.titleAr,
      titleEn: job.titleEn,
      department: job.category?.nameAr ?? "",
      location: job.location ?? "",
      type: job.employmentType ?? "full-time",
      descriptionAr: job.descriptionAr,
      descriptionEn: job.descriptionEn,
    };
  }

  async findPublished() {
    const items = await this.prisma.job.findMany({
      where: { deletedAt: null, status: ContentStatus.PUBLISHED },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return items.map((j) => this.mapJob(j));
  }

  async findPublishedBySlug(slug: string) {
    const job = await this.prisma.job.findFirst({
      where: { slug, deletedAt: null, status: ContentStatus.PUBLISHED },
      include: { category: true },
    });
    if (!job) throw new NotFoundException("Job not found");
    return this.mapJob(job);
  }

  async findAllAdmin() {
    const items = await this.prisma.job.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return items.map((j) => this.mapJob(j));
  }

  async apply(
    slug: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      coverLetter?: string;
    },
  ) {
    const job = await this.prisma.job.findFirst({
      where: { slug, deletedAt: null, status: ContentStatus.PUBLISHED },
    });
    if (!job) throw new NotFoundException("Job not found");

    await this.prisma.application.create({
      data: {
        jobId: job.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        coverLetter: data.coverLetter,
        status: ApplicationStatus.NEW,
      },
    });

    return { message: "Application submitted successfully" };
  }
}
