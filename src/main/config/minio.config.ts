import { ConfigService } from "@nestjs/config";
import { MinioModuleOptions } from "@svtslv/nestjs-minio";

export const configureMinio = (
    configService: ConfigService
): MinioModuleOptions => {
    const port =
        configService.get<number>("minio.environment.internal.port") ?? 9000;
    const secure = configService.get<boolean>("minio.environment.internal.ssl");
    return {
        config: {
            port: port,
            endPoint:
                configService.get<string>("minio.environment.internal.host") ??
                "localhost",
            accessKey: configService.get<string>("minio.credentials.access"),
            secretKey: configService.get<string>("minio.credentials.secret"),
            useSSL: secure
        }
    };
};
