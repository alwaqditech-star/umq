import { Controller, Get } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { RequirePermissions } from "../common/decorators/permissions.decorator";

@Controller("admin/projects")
@RequirePermissions("projects:read")
export class ProjectsAdminController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAllAdmin();
  }
}
