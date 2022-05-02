import { Module } from "@nestjs/common";
import { VideoRepository } from "../domain/ports/repositories/video.repository";
import { PsqlVideoRepository } from "./adapters/repositories/psql-video.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./adapters/repositories/entities/psql-video.entity";

@Module({
    controllers: [],
    imports: [TypeOrmModule.forFeature([VideoEntity])],
    providers: [{ provide: VideoRepository, useClass: PsqlVideoRepository }]
})
export class VideoModule {}
