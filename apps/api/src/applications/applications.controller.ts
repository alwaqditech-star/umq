import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { RequirePermissions } from "../common/decorators/permissions.decorator";

@Controller("admin/applications")
@RequirePermissions("applications:read")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll(@Query("jobId") jobId?: string) {
    return this.applicationsService.findAll(jobId);
  }

  @Patch(":id/status")
  @RequirePermissions("applications:manage")
  updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return this.applicationsService.updateStatus(id, body.status);
  }
}
