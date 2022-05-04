import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Result } from "@swan-io/boxed";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { Video, VideoSource } from "../../domain/models/video.model";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { PsqlVideoRepository } from "../adapters/repositories/psql-video.repository";

@Injectable()
export class InternalVideoService {
    protected readonly logger = new Logger(InternalVideoService.name);

    constructor(
        private readonly psqlVideoRepository: PsqlVideoRepository,
        private readonly videoApiMapper: VideoApiMapper
    ) {}

    async create(videoCreateDto: VideoCreateDto): Promise<Video> {
        videoCreateDto.sourceType = VideoSource.INTERNAL;
        const video: Video = this.videoApiMapper.apiToEntity(videoCreateDto);

        const result: Result<Video, Error> =
            await this.psqlVideoRepository.create(video);

        const model = result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });
        return model;
    }
}
