import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ContentStatus } from "@prisma/client";
import { ServicesService } from "./services.service";
import { RequirePermissions } from "../common/decorators/permissions.decorator";

@Controller("admin/services")
@RequirePermissions("services:read")
export class ServicesAdminController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAllAdmin();
  }

  @Post()
  @RequirePermissions("services:manage")
  create(
    @Body()
    body: {
      slug: string;
      titleAr: string;
      titleEn: string;
      summaryAr?: string;
      summaryEn?: string;
      icon?: string;
      status?: string;
    },
  ) {
    return this.servicesService.createAdmin({
      ...body,
      status:
        body.status === "published"
          ? ContentStatus.PUBLISHED
          : ContentStatus.DRAFT,
    });
  }

  @Patch(":id")
  @RequirePermissions("services:manage")
  update(
    @Param("id") id: string,
    @Body()
    body: Partial<{
      slug: string;
      titleAr: string;
      titleEn: string;
      summaryAr: string;
      summaryEn: string;
      icon: string;
      status: string;
    }>,
  ) {
    return this.servicesService.updateAdmin(id, {
      ...body,
      status:
        body.status === "published"
          ? ContentStatus.PUBLISHED
          : body.status === "draft"
            ? ContentStatus.DRAFT
            : undefined,
    });
  }

  @Delete(":id")
  @RequirePermissions("services:manage")
  remove(@Param("id") id: string) {
    return this.servicesService.removeAdmin(id);
  }
}
