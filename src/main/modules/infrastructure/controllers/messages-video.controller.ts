import { Controller, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import {
    InjectKafkaClient,
    PolyflixKafkaValue,
    TriggerType
} from "@polyflix/x-utils";
import { UserDto } from "../../application/dto/user.dto";
import { VideoResponse } from "../../application/dto/video-response.dto";
import { UserService } from "../services/user.service";
import { VideoService } from "../services/video.service";

@Controller()
export class MessageVideoController {
    private readonly logger = new Logger(MessageVideoController.name);
    private KAFKA_SUBTITLE_TOPIC: string;

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
        private readonly videoService: VideoService,
        private readonly userService: UserService
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

    @EventPattern("polyflix.user")
    async user(@Payload("value") message: PolyflixKafkaValue) {
        this.logger.log(
            `Recieve message from topic: polyflix.user - trigger: ${message.trigger}`
        );
        const userDto: UserDto = {
            id: message.payload?.id,
            avatar: message.payload?.avatar,
            firstName: message.payload?.firstName,
            lastName: message.payload?.lastName
        };

        switch (message.trigger) {
            case TriggerType.CREATE:
                this.userService.create(userDto);
                break;
            case TriggerType.UPDATE:
                this.userService.update(userDto);
                break;
        }
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
