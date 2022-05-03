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

@Module({
    controllers: [CrudVideoController, MessageVideoController],
    exports: [VideoService],
    imports: [TypeOrmModule.forFeature([VideoEntity])],
    providers: [
        VideoService,
        PsqlVideoRepository,
        VideoFilter,
        { provide: VideoRepository, useClass: PsqlVideoRepository },
        VideoApiMapper,
        VideoEntityMapper,
        ExternalVideoService,
        InternalVideoService
    ]
})
export class VideoModule {}
