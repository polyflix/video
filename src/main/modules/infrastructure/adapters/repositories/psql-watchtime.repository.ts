import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { VideoEntity } from "./entities/video.entity";
import { WatchtimeRepository } from "../../../domain/ports/repositories/watchtime.repository";
import { WatchtimeEntity } from "./entities/watchtime.entity";
import { WatchtimeEntityMapper } from "../mappers/watchtime.entity.mapper";
import { defineIsWatched } from "../../../domain/strategies/watchtime.strategy";
import { Video } from "../../../domain/models/video.model";
import { Watchtime } from "../../../domain/models/watchtime.model";
import { VideoEntityMapper } from "../mappers/video.entity.mapper";

export class PsqlWatchtimeRepository extends WatchtimeRepository {
    constructor(
        @InjectRepository(WatchtimeEntity)
        private readonly watchtimeRepo: Repository<WatchtimeEntity>,
        private readonly watchtimeEntityMapper: WatchtimeEntityMapper,
        private readonly videoEntityMapper: VideoEntityMapper,
        private connection: Connection
    ) {
        super();
    }

    async upsert(
        meId: string,
        updateWatchTimeDto: Watchtime,
        video: Video
    ): Promise<void> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const watchtime = await queryRunner.manager.findOne(
                WatchtimeEntity,
                {
                    where: {
                        userId: meId,
                        videoSlug: updateWatchTimeDto.videoId
                    }
                }
            );

            updateWatchTimeDto.userId = meId;
            if (watchtime) {
                await queryRunner.manager.update(
                    WatchtimeEntity,
                    {
                        userId: meId,
                        videoSlug: updateWatchTimeDto.videoId
                    },
                    updateWatchTimeDto
                );
                if (defineIsWatched(updateWatchTimeDto.watchedPercent)) {
                    const viewedVideo: Partial<Video> = {};
                    if (!watchtime.isWatched) {
                        viewedVideo.views = video.views + 1;
                    }
                    await queryRunner.manager.update(
                        VideoEntity,
                        {
                            slug: video.slug
                        },
                        viewedVideo
                    );
                }
            } else {
                await queryRunner.manager.save(
                    WatchtimeEntity,
                    this.watchtimeEntityMapper.apiToEntity(updateWatchTimeDto)
                );
            }
            await queryRunner.commitTransaction();
        } catch (e) {
            this.logger.error(e);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
