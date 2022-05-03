import {
    Injectable,
    Logger,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common";
import { DefaultVideoParams, VideoParams } from "../filters/video.params";
import { isYoutubeVideo, Video } from "../../domain/models/video.model";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { ExternalVideoService } from "./external-video.service";
import { InternalVideoService } from "./internal-video.service";
import { VideoRepository } from "../../domain/ports/repositories/video.repository";
import { ConfigService } from "@nestjs/config";
import { UpdateVideoDto } from "../../application/dto/video-update.dto";
import { google, youtube_v3 } from "googleapis";
import { Option } from "@swan-io/boxed";

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
        private readonly internalVideoService: InternalVideoService
    ) {}

    async create(video: VideoCreateDto): Promise<Video> {
        // const model = await this.psqlVideoRepository.create(video);

        let newVideo: Video = null;
        if (isYoutubeVideo(video.src)) {
            this.logger.debug(`New video was detected to be a external video`);
            newVideo = await this.internalVideoService.create(video);
        } else {
            this.logger.debug(`New video was detected to be an internal video`);
            newVideo = await this.externalVideoService.create(video);
        }

        return newVideo;
    }

    async findAll(params: VideoParams = DefaultVideoParams): Promise<Video[]> {
        const videos = await this.videoRepository.findAll(params);
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

    async update(id: string, dto: UpdateVideoDto): Promise<Partial<Video>> {
        const model: Option<Partial<Video>> = await this.videoRepository.update(
            id,
            {
                ...dto
            }
        );
        return this.videoApiMapper.entityToApi(
            model.match({
                Some: (value: Video) => value,
                None: () => {
                    throw new UnprocessableEntityException(
                        "This video cannot be updated right now, please try later"
                    );
                }
            })
        );
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
