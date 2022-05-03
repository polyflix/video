import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DefaultVideoParams, VideoParams } from "../filters/video.params";
import { isYoutubeVideo, Video } from "../../domain/models/video.model";
import { PsqlVideoRepository } from "../adapters/repositories/psql-video.repository";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { ExternalVideoService } from "./external-video.service";
import { InternalVideoService } from "./internal-video.service";

@Injectable()
export class VideoService {
    protected readonly logger = new Logger(VideoService.name);
    constructor(
        private readonly psqlVideoRepository: PsqlVideoRepository,
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
        const videos = await this.psqlVideoRepository.findAll(params);
        return videos.match({
            Some: (value: Video[]) => value,
            None: () => []
        });
    }

    async findOne(slug: string): Promise<Video> {
        const model = await this.psqlVideoRepository.findOne(slug);

        return model.match({
            Some: (value: Video) => value,
            None: () => {
                throw new NotFoundException("Video not found");
            }
        });
    }
}
