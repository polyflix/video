import { Injectable, NotFoundException } from "@nestjs/common";
import { DefaultVideoParams, VideoParams } from "../filters/video.params";
import { VideoResponse } from "../../application/dto/video-response.dto";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { Video } from "../../domain/models/video.model";
import { Option } from "@swan-io/boxed";
import { VideoFilter as VideoBuildFilter } from "../filters/video.filter";
import { PsqlVideoRepository } from "../adapters/repositories/psql-video.repository";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoApiMapper: VideoApiMapper,
        private readonly psqlVideoRepository: PsqlVideoRepository,
        private readonly videoFilter: VideoBuildFilter
    ) {}

    async findAll(
        params: VideoParams = DefaultVideoParams
    ): Promise<VideoResponse[]> {
        const queryBuilder = await this.psqlVideoRepository.createQueryBuilder(
            "video"
        );
        this.videoFilter.buildFilters(queryBuilder, params);
        this.videoFilter.buildPaginationAndSort(queryBuilder, params);

        const videoEntities: Video[] = await queryBuilder.getMany();

        return this.videoApiMapper.entitiesToApis(videoEntities);
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
