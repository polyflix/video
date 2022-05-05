import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Video } from "../../domain/models/video.model";
import { VideoService } from "../services/video.service";
import {
    InjectKafkaClient,
    TriggerType,
    MinIOMessage,
    KafkaMessage,
    BucketType
} from "@polyflix/x-utils";

@Controller()
export class MessageVideoController {
    private readonly logger = new Logger(MessageVideoController.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
        private readonly videoService: VideoService
    ) {}

    @MessagePattern("minio.upload")
    async process(@Payload() message: MinIOMessage) {
        this.logger.log("Recieve message from topic: minio.upload");
        const bucket = message.value.Records[0].s3.bucket.name;
        if (bucket !== BucketType.VIDEO) {
            this.logger.debug(
                `Message is not from video bucket but from: ${bucket}`
            );
            return;
        }
        const objectName = message.value.Records[0].s3.object.key;
        const topic = this.configService.get<string>("kafka.topics.subtitle");

        const video: Video = await this.videoService.findOne(objectName);

        this.kafkaClient.emit<string, KafkaMessage>(topic, {
            trigger: TriggerType.PROCESSING,
            key: video.slug,
            payload: video
        });
    }
}
