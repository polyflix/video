import {
    Controller,
    Logger,
    Param,
    Patch,
    UnprocessableEntityException
} from "@nestjs/common";
import { MockUser } from "../../../../temp.mock";
import { LikeService } from "../services/like.service";

@Controller("stats")
export class StatsVideoController {
    constructor(private readonly likeService: LikeService) {}

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
}
