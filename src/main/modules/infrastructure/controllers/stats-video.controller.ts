import {
    Body,
    Controller,
    Logger,
    Param,
    Patch,
    Post,
    UnprocessableEntityException
} from "@nestjs/common";
import { MockUser } from "../../../../temp.mock";
import { LikeService } from "../services/like.service";
import { WatchtimeDto } from "../../application/dto/watchtime.dto";
import { WatchtimeService } from "../services/watchtime.service";
import { VideoService } from "../services/video.service";

@Controller("stats")
export class StatsVideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly likeService: LikeService,
        private readonly watchtimeService: WatchtimeService
    ) {}

    private readonly logger = new Logger(StatsVideoController.name);

    @Patch("video/:id/like")
    async like(
        @MockUser() user: any,
        @Param("id") videoId: string
    ): Promise<void> {
        try {
            await this.likeService.like({ userId: user.id, videoId });
        } catch (e) {
            this.logger.log(
                `Cannot like video, userId: ${user.id}, error: ${e}`
            );
            new UnprocessableEntityException(
                `Cannot like video, userId: ${user.id}, error: ${e}`
            );
        }
    }

    @Post("video/watchtime")
    async watchTime(
        @MockUser() user: any,
        @Body() updateWatchTimeDto: WatchtimeDto
    ): Promise<void> {
        await this.watchtimeService.syncUserVideoMeta(user, updateWatchTimeDto);
    }
}
