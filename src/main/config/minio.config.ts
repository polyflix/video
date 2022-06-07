import { ConfigService } from "@nestjs/config";
import { MinioModuleOptions } from "@svtslv/nestjs-minio";

export const configureMinio = (
    configService: ConfigService
): MinioModuleOptions => {
    const port =
        configService.get<number>("minio.environment.external.port") ?? 9000;
    const secure: boolean =
        configService.get<string>("minio.environment.external.ssl") === "true";

    return {
        config: {
            port: port,
            endPoint:
                configService.get<string>("minio.environment.external.host") ??
                "localhost",
            accessKey: configService.get<string>("minio.credentials.access"),
            secretKey: configService.get<string>("minio.credentials.secret"),
            useSSL: secure
        }
    };
};
