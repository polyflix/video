import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Video } from "../../domain/models/video.model";
import { VideoService } from "../services/video.service";
import {
    InjectKafkaClient,
    TriggerType,
    MinIOMessageValue,
    PolyflixKafkaValue,
    PolyflixKafkaMessage
} from "@polyflix/x-utils";
import { MINIO_BUCKETS } from "../../../core/constants/presignedUrl.constant";
import { VideoResponse } from "../../application/dto/video-response.dto";

@Controller()
export class MessageVideoController {
    private readonly logger = new Logger(MessageVideoController.name);
    private SUBTITLE_TOPIC: string;

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
        private readonly videoService: VideoService
    ) {
        this.SUBTITLE_TOPIC = this.configService.get<string>(
            "kafka.topics.subtitle"
        );
    }

    @EventPattern("minio.upload")
    async process(@Payload("value") message: MinIOMessageValue) {
        this.logger.log("Recieve message from topic: minio.upload");
        const bucket = message.Records[0]?.s3?.bucket?.name;
        if (!bucket) {
            this.logger.debug(`No bucket found in the message`);
            return;
        }
        if (bucket !== MINIO_BUCKETS.VIDEO) {
            this.logger.debug(
                `Message is not from video bucket but from: ${bucket}`
            );
            return;
        }
        const objectName = message[0]?.s3?.object?.key;
        if (objectName) {
            this.logger.debug(`No object name found in the message`);
            return;
        }

        const video: Video = await this.videoService.findOne(objectName);

        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
            this.SUBTITLE_TOPIC,
            {
                key: video.slug,
                value: {
                    payload: video,
                    trigger: TriggerType.PROCESSING
                }
            }
        );
    }

    @EventPattern("polyflix.legacy.video")
    async video(@Payload("value") message: PolyflixKafkaValue) {
        this.logger.log(
            `Recieve message from topic: polyflix.legacy.video - trigger: ${message.trigger}`
        );
        const videoResponse: VideoResponse = Object.assign(
            new VideoResponse(),
            message.payload
        );
        switch (message.trigger) {
            case TriggerType.CREATE:
                this.videoService.create(videoResponse);
                break;
            case TriggerType.UPDATE:
                this.videoService.update(videoResponse.slug, videoResponse);
                break;
            case TriggerType.DELETE:
                // TODO
                break;
        }
    }
}
