import { Module } from "@nestjs/common";
import { VideoRepository } from "../domain/ports/repositories/video.repository";
import { PsqlVideoRepository } from "./adapters/repositories/psql-video.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./adapters/repositories/entities/psql-video.entity";
import { CrudVideoController } from "./controllers/crud-video.controller";

@Module({
    controllers: [CrudVideoController],
    imports: [TypeOrmModule.forFeature([VideoEntity])],
    providers: [{ provide: VideoRepository, useClass: PsqlVideoRepository }]
})
export class VideoModule {}
