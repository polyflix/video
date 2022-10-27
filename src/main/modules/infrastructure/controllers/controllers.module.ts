import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "@polyflix/x-utils";
import { CrudVideoController } from "./crud-video.controller";
import { StatsVideoController } from "./stats-video.controller";
import { MessageVideoController } from "./messages-video.controller";
import { UserController } from "./user.controller";
import { AdminVideoController } from "./admin/video.controller";
import { ReportVideoController } from "./report.controller";

@Module({
    controllers: [
        CrudVideoController,
        StatsVideoController,
        MessageVideoController,
        UserController,
        AdminVideoController,
        ReportVideoController
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    imports: []
})
export class ControllersModule {}
