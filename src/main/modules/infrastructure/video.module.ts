import { Module } from "@nestjs/common";
import { PsqlVideoRepository } from "./adapters/repositories/psql-video.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./adapters/repositories/entities/video.entity";
import { CrudVideoController } from "./controllers/crud-video.controller";
import { VideoService } from "./services/video.service";
import { VideoApiMapper } from "./adapters/mappers/video.api.mapper";
import { VideoEntityMapper } from "./adapters/mappers/video.entity.mapper";
import { VideoRepository } from "../domain/ports/repositories/video.repository";
import { VideoFilter } from "./filters/video.filter";
import { ExternalVideoService } from "./services/external-video.service";
import { InternalVideoService } from "./services/internal-video.service";
import { MessageVideoController } from "./controllers/messages-video.controller";
import { StatsVideoController } from "./controllers/stats-video.controller";
import { LikeService } from "./services/like.service";
import { LikeRepository } from "../domain/ports/repositories/like.repository";
import { PsqlLikeRepository } from "./adapters/repositories/psql-like.repository";
import { LikeEntityMapper } from "./adapters/mappers/like.entity.mapper";
import { LikeApiMapper } from "./adapters/mappers/like.api.mapper";
import { LikeEntity } from "./adapters/repositories/entities/like.entity";
import { TokenService } from "./services/token.service";
import { WatchtimeEntity } from "./adapters/repositories/entities/watchtime.entity";
import { WatchtimeRepository } from "../domain/ports/repositories/watchtime.repository";
import { WatchtimeApiMapper } from "./adapters/mappers/watchtime.api.mapper";
import { WatchtimeEntityMapper } from "./adapters/mappers/watchtime.entity.mapper";
import { PresignedUrlApiMapper } from "./adapters/mappers/psu.api.mapper";
import { PsqlWatchtimeRepository } from "./adapters/repositories/psql-watchtime.repository";
import { WatchtimeService } from "./services/watchtime.service";

@Module({
    controllers: [
        CrudVideoController,
        StatsVideoController,
        MessageVideoController
    ],
    exports: [VideoService, LikeService],
    imports: [
        TypeOrmModule.forFeature([VideoEntity, LikeEntity, WatchtimeEntity])
    ],
    providers: [
        VideoService,
        LikeService,
        PsqlVideoRepository,
        PsqlLikeRepository,
        VideoFilter,
        { provide: VideoRepository, useClass: PsqlVideoRepository },
        { provide: WatchtimeRepository, useClass: PsqlWatchtimeRepository },
        { provide: LikeRepository, useClass: PsqlLikeRepository },
        VideoApiMapper,
        VideoEntityMapper,
        WatchtimeApiMapper,
        WatchtimeEntityMapper,
        LikeEntityMapper,
        LikeApiMapper,
        ExternalVideoService,
        InternalVideoService,
        TokenService,
        PresignedUrlApiMapper,
        WatchtimeService
    ]
})
export class VideoModule {}
