import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { MinIoMessage } from "src/main/core/types/minio.message.type";
import { InjectKafkaClient } from "src/main/core/decorators/kafka-inject.decorator";
import { Controller, Logger } from "@nestjs/common";
import {
    KafkaEventBuilder,
    TriggerType
} from "src/main/core/types/kafkaevent.type";
import { ConfigService } from "@nestjs/config";
import { Video } from "../../domain/models/video.model";
import { VideoService } from "../services/video.service";
import { BucketType } from "src/main/core/types/bucket.type";
import { PolyflixClientKafka } from "src/main/core/configuration/kafka.client";

@Controller()
export class MessageVideoController {
    private readonly logger = new Logger(MessageVideoController.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: PolyflixClientKafka,
        private readonly configService: ConfigService,
        private readonly videoService: VideoService
    ) {}

    @MessagePattern("minio.upload")
    async process(@Payload() message: MinIoMessage) {
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

        const kafkaMessage = new KafkaEventBuilder<Video>(video.slug, video)
            .withTrigger(TriggerType.PROCESSING)
            .build();

        this.kafkaClient.emit(topic, kafkaMessage);
    }
}
