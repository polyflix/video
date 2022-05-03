import { Video } from "../../../domain/models/video.model";
import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VideoRepository } from "../../../domain/ports/repositories/video.repository";
import { VideoEntityMapper } from "../mappers/video.entity.mapper";
import { VideoEntity } from "./entities/video.entity";

export class PsqlVideoRepository extends VideoRepository {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly videoRepo: Repository<VideoEntity>,
        private readonly videoEntityMapper: VideoEntityMapper
    ) {
        super();
    }
    /**
     * Create a new entity based on video domain entity
     * @param video
     */
    async create(video: Video): Promise<Result<Video, Error>> {
        // TODO: Check whether slug is taken & generate a unique slug
        try {
            const result = await this.videoRepo.save(
                this.videoEntityMapper.apiToEntity(video)
            );
            return Result.Ok(this.videoEntityMapper.entityToApi(result));
        } catch (e) {
            return Result.Error(e);
        }
    }

    async findAll(): Promise<Option<Video[]>> {
        const result = await this.videoRepo.find();
        if (result.length === 0) {
            return Option.None();
        }
        return Option.Some(result);
    }

    async findOne(slug: string): Promise<Option<Video>> {
        try {
            const result = await this.videoRepo.findOne({
                slug
            });
            return Option.Some(this.videoEntityMapper.entityToApi(result));
        } catch (e) {
            return Option.None();
        }
    }
}
