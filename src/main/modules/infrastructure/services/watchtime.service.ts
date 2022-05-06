import {
    Injectable,
    Logger,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { WatchtimeApiMapper } from "../adapters/mappers/watchtime.api.mapper";
import { WatchtimeRepository } from "../../domain/ports/repositories/watchtime.repository";
import { WatchtimeDto } from "../../application/dto/watchtime.dto";
import { VideoEntity } from "../adapters/repositories/entities/video.entity";
import { VideoEntityMapper } from "../adapters/mappers/video.entity.mapper";

@Injectable()
export class WatchtimeService {
    constructor(
        private readonly watchtimeApiMapper: WatchtimeApiMapper,
        private readonly videoEntityMapper: VideoEntityMapper,
        private readonly watchtimeRepository: WatchtimeRepository,
        private readonly videoService: VideoService
    ) {}

    private readonly logger = new Logger(WatchtimeService.name);

    async syncUserVideoMeta(
        user: any,
        updateWatchTimeDto: WatchtimeDto
    ): Promise<void> {
        const video: VideoEntity = await this.videoService.findOne(
            updateWatchTimeDto.videoId
        );
        if (!video) throw new NotFoundException();
        if (
            !updateWatchTimeDto.isWatched &&
            video.watchDatas &&
            video.watchDatas[0].isWatched
        ) {
            updateWatchTimeDto.isWatched = true;
        }

        try {
            await this.watchtimeRepository.upsert(
                user,
                updateWatchTimeDto,
                this.videoEntityMapper.entityToApi(video)
            );
        } catch (e) {
            this.logger.warn(
                `Cannot update watchtime, userId: ${user.id}, error: ${e}`
            );
            throw new UnprocessableEntityException(
                `Cannot update watchtime, userId: ${user.id}, error: ${e}`
            );
        }
    }
}
