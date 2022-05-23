import { Video } from "../../models/video.model";
import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";
import { VideoParams } from "../../../infrastructure/filters/video.params";

export abstract class VideoRepository {
    protected readonly logger = new Logger(this.constructor.name);

    abstract findAll(
        params: VideoParams,
        me: string,
        isAdmin: boolean
    ): Promise<Option<Video[]>>;

    abstract findOne(slug: string): Promise<Option<Video>>;

    abstract create(video: Video): Promise<Result<Video, Error>>;

    abstract update(slug: string, video: Video): Promise<Result<Video, Error>>;

    abstract delete(slug: string): Promise<Result<Video, Error>>;

    abstract canAccessVideo(
        video: Video,
        userId: string
    ): Promise<Result<boolean, Error>>;
}
