import { DynamicModule, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenTelemetryModule } from "nestjs-otel";
import { AppService } from "./app.service";
import { HealthModule } from "./core/health/health.module";
import { KafkaModule } from "./core/kafka/kafka.module";
import { TodoModule } from "./modules/todo/infrastructure/todo.module";

interface AppModuleOptions {
    config?: Record<string, any>;
}

export class AppModule {
    static bootstrap(options?: AppModuleOptions): DynamicModule {
        return {
            module: AppModule,
            providers: [Logger, AppService],
            imports: [
                KafkaModule,
                HealthModule,
                TodoModule,
                OpenTelemetryModule.forRoot(),
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [() => options?.config || {}]
                })
            ]
        };
    }
}
