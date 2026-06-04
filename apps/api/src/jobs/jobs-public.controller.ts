import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { Public } from "../common/decorators/public.decorator";

@Controller("jobs")
@Public()
export class JobsPublicController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findPublished();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.jobsService.findPublishedBySlug(slug);
  }

  @Post(":slug/apply")
  apply(
    @Param("slug") slug: string,
    @Body()
    body: {
      name?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      phone?: string;
      coverLetter?: string;
    },
  ) {
    const [first, ...rest] = (body.name ?? "").trim().split(/\s+/);
    return this.jobsService.apply(slug, {
      firstName: body.firstName ?? first ?? "Applicant",
      lastName: body.lastName ?? (rest.join(" ") || "-"),
      email: body.email,
      phone: body.phone,
      coverLetter: body.coverLetter,
    });
  }
}
