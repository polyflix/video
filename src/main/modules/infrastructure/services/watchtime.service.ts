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
import { VideoEntityMapper } from "../adapters/mappers/video.entity.mapper";
import { Video } from "../../domain/models/video.model";

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
        meId: string,
        updateWatchTimeDto: WatchtimeDto
    ): Promise<void> {
        const video: Video = await this.videoService.findOne(
            updateWatchTimeDto.videoId
        );
        if (!video) throw new NotFoundException();
        if (
            !updateWatchTimeDto.isWatched &&
            video.watchtime &&
            video.watchtime.isWatched
        ) {
            updateWatchTimeDto.isWatched = true;
        }

        try {
            await this.watchtimeRepository.upsert(
                meId,
                updateWatchTimeDto,
                video
            );
        } catch (e) {
            this.logger.warn(
                `Cannot update watchtime, userId: ${meId}, error: ${e}`
            );
            throw new UnprocessableEntityException(
                `Cannot update watchtime, userId: ${meId}, error: ${e}`
            );
        }
    }
}
