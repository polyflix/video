import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { VideoService } from "../services/video.service";
import {
    InjectKafkaClient,
    TriggerType,
    PolyflixKafkaValue
} from "@polyflix/x-utils";
import { VideoResponse } from "../../application/dto/video-response.dto";

@Controller()
export class MessageVideoController {
    private readonly logger = new Logger(MessageVideoController.name);
    private KAFKA_SUBTITLE_TOPIC: string;

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
        private readonly videoService: VideoService
    ) {
        this.KAFKA_SUBTITLE_TOPIC = this.configService.get<string>(
            "kafka.topics.subtitle"
        );
    }

    @EventPattern("polyflix.subtitle")
    async process(@Payload("value") message: PolyflixKafkaValue) {
        this.logger.log("Recieve message from topic: polyflix.subtitle");
        // TODO
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
                this.videoService.create(videoResponse, null);
                break;
            case TriggerType.UPDATE:
                this.videoService.update(videoResponse.slug, videoResponse);
                break;
            case TriggerType.DELETE:
                this.videoService.delete(videoResponse.slug);
                break;
        }
    }
}
