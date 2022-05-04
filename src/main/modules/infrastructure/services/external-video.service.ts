import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException
} from "@nestjs/common";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import {
    getYoutubeVideoId,
    Video,
    VideoSource
} from "../../domain/models/video.model";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { PsqlVideoRepository } from "../adapters/repositories/psql-video.repository";

@Injectable()
export class ExternalVideoService {
    protected readonly logger = new Logger(ExternalVideoService.name);

    constructor(
        private readonly psqlVideoRepository: PsqlVideoRepository,
        private readonly videoApiMapper: VideoApiMapper
    ) {}

    async create(videoCreateDto: VideoCreateDto): Promise<Video> {
        videoCreateDto.sourceType = VideoSource.YOUTUBE;
        const video = this.videoApiMapper.apiToEntity(videoCreateDto);
        video.source = getYoutubeVideoId(video.source).match({
            Some: (value) => {
                this.logger.debug(`New video source is ${video.source}`);
                return value;
            },
            None: () => {
                throw new BadRequestException("Invalid youtube URL");
            }
        });

        const model = await this.psqlVideoRepository.create(video);
        return model.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });
    }
}
