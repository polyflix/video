import { Video } from "../../models/video.model";
import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";
import { VideoParams } from "src/main/modules/infrastructure/filters/video.params";

export abstract class VideoRepository {
    protected readonly logger = new Logger(this.constructor.name);
    abstract findAll(params: VideoParams): Promise<Option<Video[]>>;
    abstract findOne(slug: string): Promise<Option<Video>>;
    abstract create(video: Video): Promise<Result<Video, Error>>;
}
