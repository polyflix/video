import { ConfigService } from "@nestjs/config";
import { MinioModuleOptions } from "@svtslv/nestjs-minio";

export const configureMinio = (
    configService: ConfigService
): MinioModuleOptions => {
    const port = configService.get<number>("minio.port") ?? 9000;
    const secure = configService.get<string>("minio.ssl") === "true";
    return {
        config: {
            port: port,
            endPoint: configService.get<string>("minio.host") ?? "localhost",
            accessKey: configService.get<string>("minio.access_key"),
            secretKey: configService.get<string>("minio.secret_key"),
            useSSL: secure
        }
    };
};