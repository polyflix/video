import {
    Body,
    Controller,
    Logger,
    Param,
    Patch,
    Post,
    UnprocessableEntityException
} from "@nestjs/common";
import { LikeService } from "../services/like.service";
import { WatchtimeDto } from "../../application/dto/watchtime.dto";
import { WatchtimeService } from "../services/watchtime.service";
import { VideoService } from "../services/video.service";
import { MeId } from "@polyflix/x-utils";

@Controller("videos/stats")
export class StatsVideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly likeService: LikeService,
        private readonly watchtimeService: WatchtimeService
    ) {}

    private readonly logger = new Logger(StatsVideoController.name);

    @Patch(":id/like")
    async like(
        @MeId() meId: string,
        @Param("id") videoId: string
    ): Promise<void> {
        try {
            await this.likeService.like({ userId: meId, videoId });
        } catch (e) {
            this.logger.log(`Cannot like video, userId: ${meId}, error: ${e}`);
            new UnprocessableEntityException(
                `Cannot like video, userId: ${meId}, error: ${e}`
            );
        }
    }

    @Post("watchtime")
    async watchTime(
        @MeId() meId: string,
        @Body() updateWatchTimeDto: WatchtimeDto
    ): Promise<void> {
        await this.watchtimeService.syncUserVideoMeta(meId, updateWatchTimeDto);
    }
}
