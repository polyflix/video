import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { VideoEntity } from "./entities/video.entity";
import { LikeRepository } from "../../../domain/ports/repositories/like.repository";
import { LikeEntity } from "./entities/like.entity";
import { LikeEntityMapper } from "../mappers/like.entity.mapper";
import { Like } from "../../../domain/models/like.model";

export class PsqlLikeRepository extends LikeRepository {
    constructor(
        @InjectRepository(LikeEntity)
        private readonly likeRepo: Repository<LikeEntity>,
        private readonly likeEntityMapper: LikeEntityMapper,
        private connection: Connection
    ) {
        super();
    }

    /**
     * Create a new entity based on like domain entity
     * @param like
     */
    async like(like: Like): Promise<Result<Like, Error>> {
        this.logger.log(
            `New like from userId ${like.userId} for videoId ${like.videoId}`
        );
        return this.manageLike(like, true);
    }

    async unlike(like: Like): Promise<Result<Like, Error>> {
        this.logger.log(`userId ${like.userId} unlike videoId ${like.videoId}`);
        return this.manageLike(like, false);
    }

    async findOne(like: Like): Promise<Option<Like>> {
        this.logger.log(
            `Find one like for videoID ${like.videoId} and userId ${like.userId}`
        );
        try {
            const result = await this.likeRepo.findOne({
                where: {
                    videoId: like.videoId,
                    userId: like.userId
                }
            });
            if (result) {
                return Option.Some(this.likeEntityMapper.entityToApi(result));
            } else {
                return Option.None();
            }
        } catch (e) {
            return Option.None();
        }
    }

    async manageLike(
        like: Like,
        isLike: boolean
    ): Promise<Result<Like, Error>> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const video = await queryRunner.manager.findOne(
                VideoEntity,
                like.videoId
            );

            const numberOfLikes = isLike ? video.likes + 1 : video.likes - 1;

            await queryRunner.manager.update(
                VideoEntity,
                {
                    slug: like.videoId
                },
                { likes: numberOfLikes }
            );

            let result;

            if (isLike) {
                result = await queryRunner.manager.save(
                    this.likeEntityMapper.apiToEntity(like)
                );
            } else {
                result = await queryRunner.manager.delete(
                    LikeEntity,
                    this.likeEntityMapper.apiToEntity(like)
                );
            }

            await queryRunner.commitTransaction();
            return Result.Ok(result);
        } catch (e) {
            await queryRunner.rollbackTransaction();
            return Result.Error(e);
        } finally {
            await queryRunner.release();
        }
    }
}
