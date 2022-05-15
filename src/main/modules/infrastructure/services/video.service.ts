import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DefaultVideoParams, VideoParams } from "../filters/video.params";
import { isYoutubeVideo, Video } from "../../domain/models/video.model";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { ExternalVideoService } from "./external-video.service";
import { InternalVideoService } from "./internal-video.service";
import { VideoRepository } from "../../domain/ports/repositories/video.repository";
import { ConfigService } from "@nestjs/config";
import { google, youtube_v3 } from "googleapis";
import { Result } from "@swan-io/boxed";
import { VideoUpdateDto } from "../../application/dto/video-update.dto";
import {
    InjectKafkaClient,
    PolyflixKafkaMessage,
    TriggerType
} from "@polyflix/x-utils";
import { ClientKafka } from "@nestjs/microservices";
import * as urlSlug from "url-slug";
import { VideoPSU } from "../../domain/models/presigned-url.entity";

@Injectable()
export class VideoService {
    private KAFKA_VIDEO_TOPIC: string;
    private KAFKA_SUBTITLE_TOPIC: string;
    protected readonly logger = new Logger(VideoService.name);
    private readonly YOUTUBE_KEY =
        this.configService.get<string>("youtube.key");

    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly configService: ConfigService,
        private readonly videoApiMapper: VideoApiMapper,
        private readonly externalVideoService: ExternalVideoService,
        private readonly internalVideoService: InternalVideoService,
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka
    ) {
        this.KAFKA_VIDEO_TOPIC =
            this.configService.get<string>("kafka.topics.video");
        this.KAFKA_SUBTITLE_TOPIC = this.configService.get<string>(
            "kafka.topics.subtitle"
        );
    }

    async create(
        videoCreateDTO: VideoCreateDto,
        meId: string
    ): Promise<Video & VideoPSU> {
        let newVideo: Video = null;

        const videoDTO: VideoCreateDto & { slug: string } = {
            ...videoCreateDTO,
            slug: urlSlug.convert(videoCreateDTO.title)
        };

        if (isYoutubeVideo(videoDTO.source)) {
            this.logger.log(`New video was detected to be a external video`);
            newVideo = await this.externalVideoService.create(videoDTO, meId);
        } else {
            this.logger.log(`New video was detected to be an internal video`);
            newVideo = await this.internalVideoService.create(videoDTO, meId);
        }

        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
            this.KAFKA_VIDEO_TOPIC,
            {
                key: newVideo.slug,
                value: {
                    trigger: TriggerType.CREATE,
                    payload: newVideo
                }
            }
        );

        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
            this.KAFKA_SUBTITLE_TOPIC,
            {
                key: newVideo.slug,
                value: {
                    trigger: TriggerType.CREATE,
                    payload: newVideo
                }
            }
        );

        return newVideo;
    }

    async findAll(
        params: VideoParams = DefaultVideoParams,
        me: string,
        isAdmin: boolean
    ): Promise<Video[]> {
        const videos = await this.videoRepository.findAll(params, me, isAdmin);
        return videos.match({
            Some: (value: Video[]) => value,
            None: () => []
        });
    }

    async findOne(slug: string): Promise<Video> {
        const model = await this.videoRepository.findOne(slug);

        return model.match({
            Some: (value: Video) => value,
            None: () => {
                throw new NotFoundException("Video not found");
            }
        });
    }

    async update(
        id: string,
        videoDTO: VideoUpdateDto
    ): Promise<Partial<Video>> {
        const video: Video = this.videoApiMapper.apiToEntity(videoDTO);
        const result: Result<Video, Error> = await this.videoRepository.update(
            id,
            video
        );
        const model: Video = result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });

        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
            this.KAFKA_VIDEO_TOPIC,
            {
                key: model.slug,
                value: {
                    trigger: TriggerType.UPDATE,
                    payload: model
                }
            }
        );
        return model;
    }

    async delete(slug: string): Promise<void> {
        const result: Result<Video, Error> = await this.videoRepository.delete(
            slug
        );
        const model: Video = result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });

        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
            this.KAFKA_VIDEO_TOPIC,
            {
                key: model.slug,
                value: {
                    trigger: TriggerType.DELETE,
                    payload: model
                }
            }
        );
    }

    async canAccessVideo(
        video: Video,
        userId: string
    ): Promise<Result<boolean, Error>> {
        return this.videoRepository.canAccessVideo(video, userId);
    }

    async findMetadata(slug: string): Promise<youtube_v3.Schema$Video> {
        try {
            const { data }: { data: youtube_v3.Schema$VideoListResponse } =
                await google.youtube("v3").videos.list({
                    key: this.YOUTUBE_KEY,
                    id: [slug],
                    part: ["snippet"]
                });

            if (!data || data.items.length === 0) {
                this.logger.warn(`Failed to properly fetch videoId ${slug}`);
                throw new NotFoundException("video not found");
            }

            return data.items[0];
        } catch (e) {
            this.logger.warn(`Failed to properly fetch videoId ${slug}`);
            throw new NotFoundException("video not found");
        }
    }
}
