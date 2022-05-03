import {Module} from "@nestjs/common";
import {PsqlVideoRepository} from "./adapters/repositories/psql-video.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {VideoEntity} from "./adapters/repositories/entities/video.entity";
import {CrudVideoController} from "./controllers/crud-video.controller";
import {VideoService} from "./services/video.service";
import {VideoApiMapper} from "./adapters/mappers/video.api.mapper";
import {VideoEntityMapper} from "./adapters/mappers/video.entity.mapper";

@Module({
    controllers: [CrudVideoController],
    exports: [VideoService],
    imports: [TypeOrmModule.forFeature([VideoEntity])],
    providers: [
        VideoService,
        PsqlVideoRepository,
        { provide: PsqlVideoRepository, useClass: PsqlVideoRepository },
        VideoApiMapper,
        VideoEntityMapper
    ]
})
export class VideoModule {}
