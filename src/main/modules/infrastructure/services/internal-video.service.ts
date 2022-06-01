import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Result } from "@swan-io/boxed";
import {
    MINIO_THUMBNAIL_FILE_NAME,
    MINIO_VIDEO_FILE_NAME
} from "src/main/core/constants/video.constant";
import { UserDto } from "../../application/dto/user.dto";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { VideoPSU } from "../../domain/models/presigned-url.entity";
import {
    Video,
    VideoSource,
    formatMinIOFilename
} from "../../domain/models/video.model";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { PsqlVideoRepository } from "../adapters/repositories/psql-video.repository";
import { TokenService } from "./token.service";

@Injectable()
export class InternalVideoService {
    protected readonly logger = new Logger(InternalVideoService.name);

    constructor(
        private readonly psqlVideoRepository: PsqlVideoRepository,
        private readonly videoApiMapper: VideoApiMapper,
        private readonly tokenService: TokenService
    ) {}

    async create(
        videoCreateDto: VideoCreateDto & { slug: string },
        meId: string
    ): Promise<Video & VideoPSU> {
        const videoFileExtention = videoCreateDto.source.split(".")[1];
        const thumbnailFileExtention = videoCreateDto.thumbnail.split(".")[1];

        const outputVideoFilename = `${MINIO_VIDEO_FILE_NAME}.${videoFileExtention}`;
        const outputThumbnailFilename = `${MINIO_THUMBNAIL_FILE_NAME}.${thumbnailFileExtention}`;

        const source = formatMinIOFilename(
            videoCreateDto.slug,
            outputVideoFilename
        );
        const thumbnail = formatMinIOFilename(
            videoCreateDto.slug,
            outputThumbnailFilename
        );

        const video: Video = this.videoApiMapper.apiToEntity({
            ...videoCreateDto,
            sourceType: VideoSource.INTERNAL,
            thumbnail,
            source,
            ...(meId && { publisher: { id: meId } as UserDto })
        });

        const result: Result<Video, Error> =
            await this.psqlVideoRepository.create(video);

        const model = result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });

        const videoPutPsu: any = await this.tokenService.putVideoPresignedUrl(
            video.slug,
            outputVideoFilename
        );

        const thumbnailPutPsu: any =
            await this.tokenService.putThumbnailPresignedUrl(
                video.slug,
                outputThumbnailFilename
            );

        return {
            ...model,
            videoPutPsu,
            thumbnailPutPsu
        } as Video & VideoPSU;
    }
}
