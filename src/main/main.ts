import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { kafkaConfig } from "@polyflix/x-utils";
import { ISLOCAL, loadConfiguration } from "./config/loader.config";
import { logger } from "./config/logger.config";
import { configureOTel } from "./config/tracing.config";

async function bootstrap() {
    const config = loadConfiguration(logger);

    // Must be started before NestFactory
    const telemetry = configureOTel(config, logger);
    await telemetry.start();

    // Gracefully shutdown OTel data, it ensures that all data
    // has been dispatched before shutting down the server
    process.on("SIGTERM", () => {
        telemetry.shutdown().finally(() => process.exit(0));
    });

    const app = await NestFactory.create(AppModule.bootstrap({ config }), {
        logger
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "2.0.0"
    });

    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks();

    const port = config["server"]["port"] || 3000;
    app.connectMicroservice(kafkaConfig(config["kafka"]));
    if (!ISLOCAL) {
        app.startAllMicroservices();
    } else {
        await app.startAllMicroservices();
    }

    await app.listen(port, () => {
        logger.log(`Server listening on port ${port}`, "NestApplication");
    });
}

bootstrap();
