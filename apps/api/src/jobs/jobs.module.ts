import { Module } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JobsPublicController } from "./jobs-public.controller";
import { JobsAdminController } from "./jobs-admin.controller";

@Module({
  controllers: [JobsPublicController, JobsAdminController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
