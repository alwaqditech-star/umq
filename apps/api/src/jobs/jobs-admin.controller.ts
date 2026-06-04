import { Controller, Get } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { RequirePermissions } from "../common/decorators/permissions.decorator";

@Controller("admin/jobs")
@RequirePermissions("jobs:read")
export class JobsAdminController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findAllAdmin();
  }
}
