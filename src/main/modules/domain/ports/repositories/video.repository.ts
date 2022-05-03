import { Video } from "../../entities/video.entity";
import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";

export abstract class VideoRepository {
    protected readonly logger = new Logger(this.constructor.name);
    abstract findOne(slug: string): Promise<Option<Video>>;

    abstract create(video: Video): Promise<Result<Video, Error>>;
}