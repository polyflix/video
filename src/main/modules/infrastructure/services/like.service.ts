import { Injectable, NotFoundException } from "@nestjs/common";
import { VideoService } from "./video.service";
import { PsqlLikeRepository } from "../adapters/repositories/psql-like.repository";
import { LikeApiMapper } from "../adapters/mappers/like.api.mapper";
import { Like } from "../../domain/models/like.model";
import { Connection } from "typeorm";
import { Video } from "../../domain/models/video.model";
import { VideoRepository } from "../../domain/ports/repositories/video.repository";
import { LikeRepository } from "../../domain/ports/repositories/like.repository";
import { LikeDto } from "../../application/dto/like.dto";

@Injectable()
export class LikeService {
    constructor(
        private readonly likeApiMapper: LikeApiMapper,
        private readonly likeRepository: LikeRepository,
        private readonly videoService: VideoService
    ) {}

    async like(like: LikeDto): Promise<void> {
        const video = await this.videoService.findOne(like.videoId);
        if (!video) throw new NotFoundException();

        const model = await this.likeRepository.findOne(like);
        const likedb = model.match({
            Some: (value: Like) => value,
            None: () => {
                return null;
            }
        });
        if (likedb) {
            await this.likeRepository.unlike(like);
        } else {
            await this.likeRepository.like(like);
        }
    }
}
