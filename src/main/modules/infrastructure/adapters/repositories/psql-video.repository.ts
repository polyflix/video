import { isYoutubeVideo, Video } from "../../../domain/models/video.model";
import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { VideoRepository } from "../../../domain/ports/repositories/video.repository";
import { VideoEntityMapper } from "../mappers/video.entity.mapper";
import { VideoEntity } from "./entities/video.entity";
import { VideoCreateDto } from "src/main/modules/application/dto/video-create.dto";
import { DefaultVideoParams, VideoParams } from "../../filters/video.params";
import { VideoFilter } from "../../filters/video.filter";
import { VideoApiMapper } from "../mappers/video.api.mapper";

export class PsqlVideoRepository extends VideoRepository {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly videoRepo: Repository<VideoEntity>,
        private readonly videoEntityMapper: VideoEntityMapper,
        private readonly videoFilter: VideoFilter
    ) {
        super();
    }
    /**
     * Create a new entity based on video domain entity
     * @param video
     */
    async create(video: Video): Promise<Result<Video, Error>> {
        // TODO: Check whether slug is taken & generate a unique slug
        this.logger.log(`Create a video with slug ${video.slug}`);

        try {
            const result = await this.videoRepo.save(
                this.videoEntityMapper.apiToEntity(video)
            );
            return Result.Ok(this.videoEntityMapper.entityToApi(result));
        } catch (e) {
            return Result.Error(e);
        }
    }

    async findAll(
        params: VideoParams = DefaultVideoParams
    ): Promise<Option<Video[]>> {
        const queryBuilder = this.videoRepo.createQueryBuilder("video");
        this.videoFilter.buildFilters(queryBuilder, params);
        this.videoFilter.buildPaginationAndSort(queryBuilder, params);

        const result = await queryBuilder.getMany();
        if (result.length === 0) {
            return Option.None();
        }
        return Option.Some(this.videoEntityMapper.entitiesToApis(result));
    }

    async findOne(slug: string): Promise<Option<Video>> {
        this.logger.log(`Find one video with slug ${slug}`);
        try {
            const result = await this.videoRepo.findOne({
                slug
            });
            return Option.fromNullable<Video>(
                this.videoEntityMapper.entityToApi(result)
            );
        } catch (e) {
            return Option.None();
        }
    }

    async createQueryBuilder(
        alias: string
    ): Promise<SelectQueryBuilder<VideoEntity>> {
        return this.videoRepo.createQueryBuilder(alias);
    }
}
