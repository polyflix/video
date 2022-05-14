import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException
} from "@nestjs/common";
import { Result } from "@swan-io/boxed";
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

    async create(videoCreateDto: VideoCreateDto, meId: string): Promise<Video> {
        const source = getYoutubeVideoId(videoCreateDto.source).match({
            Some: (value) => {
                this.logger.debug(
                    `New video source is ${videoCreateDto.source}`
                );
                return value;
            },
            None: () => {
                throw new BadRequestException("Invalid youtube URL");
            }
        });
        const video: Video = this.videoApiMapper.apiToEntity({
            ...videoCreateDto,
            sourceType: VideoSource.YOUTUBE,
            source,
            ...(meId && { publisherId: meId })
        });

        const result: Result<Video, Error> =
            await this.psqlVideoRepository.create(video);

        return result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });
    }
}
