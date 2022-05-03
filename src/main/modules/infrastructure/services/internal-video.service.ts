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

        const model: Result<Video, Error> =
            await this.psqlVideoRepository.create(video);

        return model.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });
    }

    // private async generateVideoLinks(
    //     video: Video,
    //     videoRequest: Pick<CreateVideoDto, "src" | "thumbnail">
    // ): Promise<VideoPSU> {
    //     const videoFileExt = videoRequest.src.split(".")[1];
    //     const thumbnailFileExt = videoRequest.thumbnail.split(".")[1];

    //     const outputVideoFilename = `${MINIO_VIDEO_FILE_NAME}.${videoFileExt}`;
    //     const outputThumbnailFilename = `${MINIO_THUMBNAIL_FILE_NAME}.${thumbnailFileExt}`;

    //     video.source = formatMinIOVideoFilename(
    //         video.slug,
    //         outputVideoFilename
    //     );

    //     this.logger.debug(
    //         `generateVideoLinks(), new source is ${video.source}`
    //     );
    //     if (videoRequest.thumbnail)
    //         video.thumbnail = formatMinIOThumbnailFilename(
    //             video.slug,
    //             outputThumbnailFilename
    //         );

    //     this.logger.debug(
    //         `generateVideoLinks(), new thumbnail source is ${video.thumbnail}`
    //     );

    //     await this.videoService.update(video.id, {
    //         source: video.source,
    //         thumbnail: video.thumbnail
    //     });
    //     this.logger.debug(
    //         `generateVideoLinks(), updated video source & thumbnail`
    //     );
    //     return {
    //         videoPutPsu: await this.tokenService.putVideoPresignedUrl(
    //             video.slug,
    //             outputVideoFilename
    //         ),
    //         thumbnailPutPsu: await this.tokenService.putThumbnailPresignedUrl(
    //             video.slug,
    //             outputThumbnailFilename
    //         )
    //     };
    // }
}
