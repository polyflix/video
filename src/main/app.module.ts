import { DynamicModule, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OpenTelemetryModule } from "nestjs-otel";
import { AppService } from "./app.service";
import { HealthModule } from "./core/health/health.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configureTypeORM } from "./config/database.config";
import { VideoModule } from "./modules/infrastructure/video.module";
import { MinioConfigModule } from "./core/configuration/minio.module";
import { KafkaModule } from "./core/configuration/kafka.module";

interface AppModuleOptions {
    config?: Record<string, any>;
}

export class AppModule {
    static bootstrap(options?: AppModuleOptions): DynamicModule {
        return {
            module: AppModule,
            providers: [Logger, AppService],
            imports: [
                MinioConfigModule,
                KafkaModule,
                HealthModule,
                VideoModule,
                OpenTelemetryModule.forRoot(),
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [() => options?.config || {}]
                }),
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    imports: [ConfigModule],
                    useFactory: configureTypeORM
                })
            ]
        };
    }
}
