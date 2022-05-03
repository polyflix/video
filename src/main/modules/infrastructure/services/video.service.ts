import { Injectable, NotFoundException } from "@nestjs/common";
import { PsqlVideoRepository } from "../adapters/repositories/psql-video.repository";
import { DefaultVideoParams, VideoParams } from "../filters/video.params";
import { VideoResponse } from "../../application/dto/video-response.dto";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { Video } from "../../domain/models/video.model";
import { Option } from "@swan-io/boxed";
import { VideoRepository } from "../../domain/ports/repositories/video.repository";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoApiMapper: VideoApiMapper,
        private readonly psqlVideoRepository: VideoRepository
    ) {}

    async findAll(
        params: VideoParams = DefaultVideoParams
    ): Promise<VideoResponse[]> {
        const models: Option<Video[]> =
            await this.psqlVideoRepository.findAll();

        return this.videoApiMapper.entitiesToApis(
            models.match({
                Some: (value: Video[]) => value,
                None: () => {
                    throw new NotFoundException("Video not found");
                }
            })
        );
    }

    async findOne(slug: string): Promise<VideoResponse> {
        const model: Option<Video> = await this.psqlVideoRepository.findOne(
            slug
        );

        return this.videoApiMapper.entityToApi(
            model.match({
                Some: (value: Video) => value,
                None: () => {
                    throw new NotFoundException("Video not found");
                }
            })
        );
    }
}
