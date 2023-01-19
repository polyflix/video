import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Option, Result } from "@swan-io/boxed";
import { google, youtube_v3 } from "googleapis";
import { nanoid } from "nanoid";
import { Span } from "nestjs-otel";
import * as urlSlug from "url-slug";
import { MINIO_THUMBNAIL_FILE_NAME } from "../../../core/constants/video.constant";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { VideoResponse } from "../../application/dto/video-response.dto";
import { VideoUpdateDto } from "../../application/dto/video-update.dto";
import { VideoPSU } from "../../domain/models/presigned-url.entity";
import {
    formatMinIOFilename,
    isYoutubeVideo,
    Video
} from "../../domain/models/video.model";
import { VideoPublisher } from "../../domain/ports/publishers/video.publisher";
import { VideoRepository } from "../../domain/ports/repositories/video.repository";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { DefaultVideoParams, VideoParams } from "../filters/video.params";
import { ExternalVideoService } from "./external-video.service";
import { InternalVideoService } from "./internal-video.service";
import { TokenService } from "./token.service";

@Injectable()
export class VideoService {
    protected readonly logger = new Logger(VideoService.name);
    private readonly YOUTUBE_KEY =
        this.configService.get<string>("youtube.key");

    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly configService: ConfigService,
        private readonly videoApiMapper: VideoApiMapper,
        private readonly externalVideoService: ExternalVideoService,
        private readonly internalVideoService: InternalVideoService,
        private readonly videoPublisher: VideoPublisher,
        private readonly tokenService: TokenService
    ) {}

    async create(
        videoCreateDTO: VideoCreateDto,
        meId: string
    ): Promise<Video & VideoPSU> {
        let newVideo: Video = null;

        const videoDTO: VideoCreateDto & { slug: string } = {
            ...videoCreateDTO,
            slug: `${urlSlug.convert(videoCreateDTO.title)}-${nanoid(5)}`
        };

        if (isYoutubeVideo(videoDTO.source)) {
            this.logger.log(`New video was detected to be a external video`);
            newVideo = await this.externalVideoService.create(videoDTO, meId);
        } else {
            this.logger.log(`New video was detected to be an internal video`);
            newVideo = await this.internalVideoService.create(videoDTO, meId);
        }

        newVideo.attachments = videoCreateDTO.attachments;
        this.videoPublisher.publishVideoCreate(newVideo);
        return newVideo;
    }

    @Span("VIDEO_SERVICE_FIND_ALL")
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

    async count(params: VideoParams): Promise<number> {
        return this.videoRepository.count(params);
    }

    async findOne(slug: string, meId?: string): Promise<Video> {
        const model = await this.videoRepository.findOne(slug, meId);

        return model.match({
            Some: (value: Video) => value,
            None: () => {
                throw new NotFoundException("Video not found");
            }
        });
    }

    async update(
        slug: string,
        videoDTO: Partial<VideoUpdateDto>
    ): Promise<Video & VideoPSU> {
        let outputThumbnailFilename = null;
        if (videoDTO.thumbnail) {
            const thumbnailFileExtension = videoDTO.thumbnail.split(".")[1];
            outputThumbnailFilename = `${MINIO_THUMBNAIL_FILE_NAME}.${thumbnailFileExtension}`;
        }

        const oldVideoOption: Option<Video> =
            await this.videoRepository.findOne(slug);
        const oldVideo: Video = oldVideoOption.match({
            Some: (value) => value,
            None: () => {
                throw new NotFoundException("Video not found");
            }
        });

        const updateObject: Partial<VideoResponse> = {
            ...oldVideo,
            ...videoDTO,
            source: oldVideo.source
        };

        if (videoDTO.thumbnail) {
            updateObject.thumbnail = outputThumbnailFilename
                ? formatMinIOFilename(oldVideo.slug, outputThumbnailFilename)
                : oldVideo.thumbnail;
        }

        const video: Video = this.videoApiMapper.apiToEntity(updateObject);

        const result: Result<Video, Error> = await this.videoRepository.update(
            slug,
            video
        );
        const model: Video = result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });

        const thumbnailPutPsu: any =
            await this.tokenService.putThumbnailPresignedUrl(
                video.slug,
                outputThumbnailFilename
            );

        model.attachments = videoDTO.attachments;
        this.videoPublisher.publishVideoUpdate(model);
        return { ...model, thumbnailPutPsu } as Video & VideoPSU;
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

        this.videoPublisher.publishVideoDelete(model);
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
