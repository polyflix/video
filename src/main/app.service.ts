import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";

@Injectable()
export class AppService implements OnApplicationBootstrap {
    private readonly logger = new Logger(AppService.name);

    constructor(
        @InjectMinioClient() private readonly minioClient: MinioClient
    ) {}

    async onApplicationBootstrap() {
        await Promise.all([this.connectMinio()]).catch((err) => {
            this.logger.error("Could not run the application, reason: " + err);
            process.exit(0);
        });
    }

    /**
     * Check whether or not the connection to minio is working properly
     */
    async connectMinio() {
        return new Promise<void>((resolve, reject) => {
            this.minioClient
                .listBuckets()
                .then(() => resolve())
                .catch((err) => {
                    this.logger.error("Could not connect to MinIO server");
                    this.logger.error(err);
                    reject("Could not connect to MinIO Server");
                });
        });
    }
}
