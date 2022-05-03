import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnApplicationShutdown
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ISLOCAL } from "./config/loader.config";
import { InjectKafkaClient } from "./core/decorators/kafka-inject.decorator";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";

@Injectable()
export class AppService
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    private readonly logger = new Logger(AppService.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientProxy,
        @InjectMinioClient() private readonly minioClient: MinioClient
    ) {}

    async onApplicationBootstrap() {
        await Promise.all([
            this.connectKafkaClient(),
            this.connectMinio()
        ]).catch((err) => {
            this.logger.error("Could not run the application, reason: " + err);
            process.exit(0);
        });
    }

    /**
     * Check whether or not the connection to kafka is working properly
     * If in local, we check asynchronously else it's synchronous
     */
    async connectKafkaClient() {
        if (ISLOCAL) {
            this.kafkaClient
                .connect()
                .then(() => this.logger.log("Kafka client connection open"))
                .catch(() =>
                    this.logger.error("Can't open Kafka client connection")
                );
        } else {
            try {
                await this.kafkaClient.connect();
                this.logger.log("Kafka client connection open");
            } catch (error) {
                this.logger.error("Can't open Kafka client connection");
            }
        }
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

    onApplicationShutdown() {
        this.kafkaClient.close();
        this.logger.log("Kafka client connection closed");
    }
}
