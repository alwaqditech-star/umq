import { Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapStatus(
    status: ApplicationStatus,
  ): "new" | "reviewing" | "shortlisted" | "rejected" {
    const map: Record<
      ApplicationStatus,
      "new" | "reviewing" | "shortlisted" | "rejected"
    > = {
      NEW: "new",
      REVIEWING: "reviewing",
      SHORTLISTED: "shortlisted",
      REJECTED: "rejected",
      HIRED: "shortlisted",
    };
    return map[status];
  }

  private mapApplication(app: {
    id: string;
    jobId: string;
    firstName: string;
    lastName: string;
    email: string;
    status: ApplicationStatus;
    createdAt: Date;
    job: { titleAr: string };
  }) {
    return {
      id: app.id,
      jobId: app.jobId,
      applicantName: `${app.firstName} ${app.lastName}`.trim(),
      email: app.email,
      status: this.mapStatus(app.status),
      appliedAt: app.createdAt.toISOString(),
      jobTitle: app.job.titleAr,
    };
  }

  async findAll(jobId?: string) {
    const items = await this.prisma.application.findMany({
      where: {
        deletedAt: null,
        ...(jobId ? { jobId } : {}),
      },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });
    return items.map((a) => this.mapApplication(a));
  }

  async updateStatus(id: string, status: string) {
    const prismaStatus = status.toUpperCase() as ApplicationStatus;
    if (!Object.values(ApplicationStatus).includes(prismaStatus)) {
      throw new NotFoundException("Invalid status");
    }
    const app = await this.prisma.application.update({
      where: { id },
      data: { status: prismaStatus },
      include: { job: true },
    });
    return this.mapApplication(app);
  }
}
