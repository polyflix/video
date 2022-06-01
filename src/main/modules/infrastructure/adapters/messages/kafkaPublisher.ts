import { VideoPublisher } from "../../../domain/ports/publishers/video.publisher";
import {
    InjectKafkaClient,
    PolyflixKafkaMessage,
    TriggerType
} from "@polyflix/x-utils";
import { Video } from "../../../domain/models/video.model";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";

export class KafkaPublisher extends VideoPublisher {
    private readonly KAFKA_VIDEO_TOPIC: string;
    private readonly KAFKA_SUBTITLE_TOPIC: string;
    protected readonly logger = new Logger(this.constructor.name);
    constructor(
        private readonly configService: ConfigService,
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka
    ) {
        super();
        this.KAFKA_VIDEO_TOPIC =
            this.configService.get<string>("kafka.topics.video");
        this.KAFKA_SUBTITLE_TOPIC = this.configService.get<string>(
            "kafka.topics.subtitle"
        );
    }

    protected tryPublishMessage(trigger: TriggerType, payload: Video) {
        this.logger.log(
            "[" +
                trigger +
                "] Publishing event for video (" +
                payload.slug +
                ")"
        );
        try {
            this.kafkaClient.emit<string, PolyflixKafkaMessage>(
                this.KAFKA_VIDEO_TOPIC,
                {
                    key: payload.slug,
                    value: {
                        trigger,
                        payload
                    }
                }
            );
        } catch (e) {
            this.logger.error("Could not kafka message, reason: " + e);
        }
    }

    publishVideoCreate(video: Video) {
        this.tryPublishMessage(TriggerType.UPDATE, video);
    }

    publishVideoDelete(video: Video) {
        this.tryPublishMessage(TriggerType.UPDATE, video);
    }

    publishVideoUpdate(video: Video) {
        this.tryPublishMessage(TriggerType.UPDATE, video);
    }
}
