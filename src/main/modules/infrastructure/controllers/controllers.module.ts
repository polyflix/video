import { Logger, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import {
    AuthorizationService,
    configureAuthZService,
    RolesGuard
} from "@polyflix/x-utils";
import { CrudVideoController } from "./crud-video.controller";
import { StatsVideoController } from "./stats-video.controller";
import { MessageVideoController } from "./messages-video.controller";
import { UserController } from "./user.controller";
import { AdminVideoController } from "./admin/video.controller";
import { ReportVideoController } from "./report.controller";
import { AuthorizationModule } from "@polyflix/x-utils";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
    imports: [
        AuthorizationModule.register({
            useFactory: (cfgSvc: ConfigService) => {
                const config = configureAuthZService(cfgSvc);
                return new AuthorizationService(config);
            },
            inject: [ConfigService],
            imports: [ConfigModule]
        })
    ]
})
export class ControllersModule {}
