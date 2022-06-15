import { Video } from "../../../domain/models/video.model";
import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { VideoRepository } from "../../../domain/ports/repositories/video.repository";
import { VideoEntityMapper } from "../mappers/video.entity.mapper";
import { VideoEntity } from "./entities/video.entity";
import { DefaultVideoParams, VideoParams } from "../../filters/video.params";
import { VideoFilter } from "../../filters/video.filter";
import { NotFoundException } from "@nestjs/common";
import { has } from "lodash";

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
        const videoEntity: VideoEntity =
            this.videoEntityMapper.apiToEntity(video);
        try {
            const result = await this.videoRepo.save(videoEntity);
            const newVideo = await this.videoRepo.findOne({
                where: {
                    slug: result.slug
                }
            });
            return Result.Ok(this.videoEntityMapper.entityToApi(newVideo));
        } catch (e) {
            return Result.Error(e);
        }
    }

    async findAll(
        params: VideoParams = DefaultVideoParams,
        me: string,
        isAdmin: boolean
    ): Promise<Option<Video[]>> {
        const queryBuilder = this.videoQueryBuilder();

        if (me && !has(params, "isWatched") && !has(params, "isWatching"))
            this.videoFilter.buildWithUserMeta(queryBuilder, me);

        this.videoFilter.buildFilters(queryBuilder, params, me, isAdmin);
        this.videoFilter.buildPaginationAndSort(queryBuilder, params);

        const result = await queryBuilder.getMany();
        if (result.length === 0) {
            return Option.None();
        }
        return Option.Some(this.videoEntityMapper.entitiesToApis(result));
    }

    async count(params: VideoParams): Promise<number> {
        const queryBuilder = this.videoRepo.createQueryBuilder("video");
        this.videoFilter.totalCount(queryBuilder, params);

        const count = await queryBuilder.getCount();

        return count || 0;
    }

    async findOne(slug: string, userId?: string): Promise<Option<Video>> {
        this.logger.log(`Find one video with slug ${slug}`);
        const queryBuilder = this.videoQueryBuilder();
        if (userId) {
            this.videoFilter.buildWithUserMeta(queryBuilder, userId);
        }
        queryBuilder.andWhere("video.slug = :slug", { slug });
        const result = await queryBuilder.getOne();

        if (result) {
            return Option.Some(this.videoEntityMapper.entityToApi(result));
        }
        return Option.None();
    }

    private videoQueryBuilder(): SelectQueryBuilder<VideoEntity> {
        return this.videoRepo
            .createQueryBuilder("video")
            .leftJoinAndSelect("video.publisher", "publisher");
    }

    async update(slug: string, video: Video): Promise<Result<Video, Error>> {
        this.logger.log(`Update a video with slug ${video.slug}`);
        try {
            const entity = this.videoEntityMapper.apiToEntity(video);
            const result = await this.videoRepo.save(entity);
            const newVideo = await this.videoRepo.findOne({
                where: {
                    slug: result.slug
                }
            });
            return Result.Ok(this.videoEntityMapper.entityToApi(newVideo));
        } catch (e) {
            return Result.Error(e);
        }
    }

    async delete(slug: string): Promise<Result<Video, Error>> {
        const video = await this.findOne(slug);
        this.logger.log(`Delete a video with slug ${slug}`);
        try {
            await this.videoRepo.delete({
                slug: slug
            });
            if (video.isSome()) {
                return Result.Ok(video.get());
            }
            throw new NotFoundException("Video not found");
        } catch (e) {
            return Result.Error(e);
        }
    }

    async canAccessVideo(
        video: Video,
        userId: string
    ): Promise<Result<boolean, Error>> {
        try {
            const hasAccess: [] = await this.videoRepo.query(
                `
                    SELECT v.id              as video_id,
                           v."publisherId"   as vid_publisher,
                           col.id            as col_id,
                           col."publisherId" as col_publisher
                    FROM video v
                             LEFT JOIN collection_videos_video col_vid ON col_vid."videoId" = v.id
                             LEFT JOIN collection col ON col.id = col_vid."collectionId"
                             LEFT JOIN course_collections_collection cr_col ON col.id = cr_col."collectionId"
                             LEFT JOIN course cr ON cr_col."courseId" = cr.id
                             LEFT JOIN course_path_join cpj on cr.id = cpj."courseId"
                             LEFT JOIN path p on cpj."pathId" = p.id
                    WHERE v.id = $1
                      AND (
                                col."publisherId" = $2 OR
                                cr."publisherId" = $2 OR
                                p."publisherId" = $2
                        )`,
                [video.slug, userId]
            );
            if (hasAccess.length > 0) {
                return Result.Ok(true);
            }
            Result.Error(false);
        } catch (e) {
            return Result.Error(e);
        }
    }
}
