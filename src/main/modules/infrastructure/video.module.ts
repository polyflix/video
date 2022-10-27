import { Global, Module } from "@nestjs/common";
import { PsqlVideoRepository } from "./adapters/repositories/psql-video.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./adapters/repositories/entities/video.entity";
import { VideoService } from "./services/video.service";
import { VideoApiMapper } from "./adapters/mappers/video.api.mapper";
import { VideoEntityMapper } from "./adapters/mappers/video.entity.mapper";
import { VideoRepository } from "../domain/ports/repositories/video.repository";
import { VideoFilter } from "./filters/video.filter";
import { ExternalVideoService } from "./services/external-video.service";
import { InternalVideoService } from "./services/internal-video.service";
import { LikeService } from "./services/like.service";
import { LikeRepository } from "../domain/ports/repositories/like.repository";
import { PsqlLikeRepository } from "./adapters/repositories/psql-like.repository";
import { LikeEntityMapper } from "./adapters/mappers/like.entity.mapper";
import { LikeApiMapper } from "./adapters/mappers/like.api.mapper";
import { LikeEntity } from "./adapters/repositories/entities/like.entity";
import { TokenService } from "./services/token.service";
import { PsqlUserRepository } from "./adapters/repositories/psql-user.repository";
import { UserRepository } from "../domain/ports/repositories/user.repository";
import { UserEntityMapper } from "./adapters/mappers/user.entity.mapper";
import { UserApiMapper } from "./adapters/mappers/user.api.mapper";
import { UserService } from "./services/user.service";
import { UserEntity } from "./adapters/repositories/entities/user.entity";
import { WatchtimeEntity } from "./adapters/repositories/entities/watchtime.entity";
import { WatchtimeRepository } from "../domain/ports/repositories/watchtime.repository";
import { WatchtimeApiMapper } from "./adapters/mappers/watchtime.api.mapper";
import { WatchtimeEntityMapper } from "./adapters/mappers/watchtime.entity.mapper";
import { PresignedUrlApiMapper } from "./adapters/mappers/psu.api.mapper";
import { PsqlWatchtimeRepository } from "./adapters/repositories/psql-watchtime.repository";
import { WatchtimeService } from "./services/watchtime.service";
import { ControllersModule } from "./controllers/controllers.module";
import { VideoPublisher } from "../domain/ports/publishers/video.publisher";
import { KafkaPublisher } from "./adapters/messages/kafkaPublisher";
import { ReportService } from "./services/report.service";
import { ReportEntity } from "./adapters/repositories/entities/report.entity";
import { ReportRepository } from "../domain/ports/repositories/report.repository";
import { PsqlReportRepository } from "./adapters/repositories/psql-report.repository";
import { ReportEntityMapper } from "./adapters/mappers/report.entity.mapper";
import { ReportApiMapper } from "./adapters/mappers/report.api.mapper";
import { ReportFilter } from "./filters/report.filter";

@Module({
    exports: [
        VideoService,
        LikeService,
        VideoRepository,
        VideoApiMapper,
        ExternalVideoService,
        InternalVideoService,
        PresignedUrlApiMapper,
        ReportApiMapper,
        TokenService,
        WatchtimeService,
        UserService,
        ReportService,
        VideoPublisher
    ],
    imports: [
        TypeOrmModule.forFeature([
            VideoEntity,
            LikeEntity,
            UserEntity,
            WatchtimeEntity,
            ReportEntity
        ]),
        ControllersModule
    ],
    providers: [
        VideoService,
        LikeService,
        UserService,
        ReportService,
        PsqlVideoRepository,
        PsqlLikeRepository,
        PsqlUserRepository,
        VideoFilter,
        ReportFilter,
        { provide: VideoRepository, useClass: PsqlVideoRepository },
        { provide: WatchtimeRepository, useClass: PsqlWatchtimeRepository },
        { provide: LikeRepository, useClass: PsqlLikeRepository },
        { provide: UserRepository, useClass: PsqlUserRepository },
        { provide: VideoPublisher, useClass: KafkaPublisher },
        { provide: ReportRepository, useClass: PsqlReportRepository },
        VideoApiMapper,
        VideoEntityMapper,
        WatchtimeApiMapper,
        WatchtimeEntityMapper,
        LikeEntityMapper,
        LikeApiMapper,
        UserEntityMapper,
        UserApiMapper,
        ExternalVideoService,
        InternalVideoService,
        TokenService,
        PresignedUrlApiMapper,
        ReportEntityMapper,
        ReportApiMapper,
        WatchtimeService
    ]
})
@Global()
export class VideoModule {}
