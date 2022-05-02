import { VideoRepository } from "../../../domain/ports/repositories/video.repository";
import { Video } from "../../../domain/entities/video.entity";
import { Option, Result } from "@swan-io/boxed";
import { VideoEntity } from "./entities/psql-video.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlVideoRepository extends VideoRepository {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly videoRepo: Repository<VideoEntity>
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
                this.#toVideoEntity(video)
            );
            return Result.Ok(this.#toVideo(result));
        } catch (e) {
            return Result.Error(e);
        }
    }

    async findOne(slug: string): Promise<Option<Video>> {
        try {
            const result = await this.videoRepo.findOne({
                slug
            });
            return Option.Some(this.#toVideo(result));
        } catch (e) {
            return Option.None();
        }
    }

    /**
     * Private method that can convert domain video entity
     * to postgres video entity
     * @param {Video} video -- Video entity
     * @private
     */
    #toVideoEntity(video: Video): VideoEntity {
        const entity = new VideoEntity();
        Object.assign(entity, video);
        return entity;
    }

    /**
     * Method that can convert a repository specific to domain entity
     * @param entity
     * @private
     */
    #toVideo(entity: VideoEntity): Video {
        const video = new Video();
        Object.assign(video, entity);
        return video;
    }
}
