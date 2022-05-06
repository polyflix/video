import { Logger } from "@nestjs/common";
import { Watchtime } from "../../models/watchtime.model";
import { Video } from "../../models/video.model";

export abstract class WatchtimeRepository {
    protected readonly logger = new Logger(this.constructor.name);

    abstract upsert(
        user: any,
        updateWatchTimeDto: Watchtime,
        video: Video
    ): Promise<void>;
}
