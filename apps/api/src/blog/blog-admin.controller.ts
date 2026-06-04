import { Controller, Get } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { RequirePermissions } from "../common/decorators/permissions.decorator";

@Controller("admin/blog/posts")
@RequirePermissions("blog:read")
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() {
    return this.blogService.findAllAdmin();
  }
}
