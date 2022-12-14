import { Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { logger } from "../../../config/logger.config";
import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";
import { VideoInvalidError } from "../errors/video-invalid.error";
import { User } from "./user.model";
import { Watchtime } from "./watchtime.model";

const YOUTUBE_MATCH_REGEX =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

const isInternalSourceValid = (source: string): boolean => {
    return /^.+[.]mp4$/.test(source);
};

export const isThumbnailValid = (source: string): boolean => {
    return /^.+[.](png|jpg|jpeg)$/.test(source);
};

export const isYoutubeVideo = (url: string) => {
    const regex = new RegExp(YOUTUBE_MATCH_REGEX, "gi");
    return regex.test(url);
};

export const getYoutubeVideoId = (url: string): Option<string> => {
    if (!isYoutubeVideo(url)) return Option.None();

    const regex = new RegExp(YOUTUBE_MATCH_REGEX);
    const result = regex.exec(url);
    if (result) return Option.Some(result[1]);
    return null;
};

export const isFile = (source: string): boolean => {
    return /^([a-zA-Z0-9\s_\-\(\)])+([.][a-zA-Z0-9]+)$/.test(source);
};

export const formatMinIOFilename = (videoSlug: string, file: string) => {
    return `${videoSlug}/${file}`;
};

export enum VideoSource {
    YOUTUBE = "youtube",
    INTERNAL = "internal",
    UNKNOWN = "unknown"
}

export class VideoProps {
    id: string;

    slug: string;

    title: string;

    description: string;

    thumbnail: string;

    publisher: User;

    visibility: Visibility;

    draft: boolean;

    likes?: number;

    views?: number;

    sourceType: VideoSource;

    source: string;

    watchtime?: Watchtime;

    watchtimes?: Watchtime[];

    attachments?: string[];

    createdAt?: Date;

    updatedAt?: Date;
}

export class Video {
    protected readonly logger = new Logger(Video.name);

    private constructor(
        public slug: string,
        public id: string,
        public title: string,
        public description: string,
        public thumbnail: string,
        public publisher: User,
        public visibility: Visibility,
        public draft: boolean,
        public likes: number,
        public views: number,
        public sourceType: VideoSource,
        public source: string,
        public watchtime: Watchtime,
        public attachments?: string[],
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}

    static create(props: VideoProps): Video {
        const video = new Video(
            props.slug,
            props.id,
            props.title,
            props.description,
            props.thumbnail,
            props.publisher,
            props.visibility,
            props.draft,
            props.likes,
            props.views,
            props.sourceType,
            props.source,
            props.watchtime,
            props.attachments,
            props.createdAt,
            props.updatedAt
        );

        return video.validate().match({
            Ok: () => video,
            Error: (e) => {
                logger.error(e);
                throw new VideoInvalidError(e);
            }
        });
    }

    private validate(): Result<string, string> {
        if (!this.source || !this.thumbnail) {
            return Result.Error("No source or thumbnail specified");
        }
        if (
            this.sourceType === VideoSource.INTERNAL &&
            !isInternalSourceValid(this.source)
        ) {
            return Result.Error("This video source is not yet allowed");
        }
        if (
            this.sourceType === VideoSource.INTERNAL &&
            !isThumbnailValid(this.thumbnail)
        ) {
            return Result.Error("This thumbnail format is not yet allowed");
        }
        if (
            this.sourceType === VideoSource.INTERNAL &&
            !isFile(this.source.split("/")?.pop())
        ) {
            return Result.Error("Source should be a local file name");
        }
        if (
            this.sourceType === VideoSource.INTERNAL &&
            !isFile(this.thumbnail.split("/")?.pop())
        ) {
            return Result.Error("Source thumbnail should be a local file name");
        }
        return Result.Ok("Model Valid");
    }

    static canAccessVideo(
        video: Video,
        userId: string
    ): Result<string, string> {
        const isVideoAuthor = userId === video.publisher?.id;
        const isVideoPublic = video.visibility === Visibility.PUBLIC;

        if (!isVideoPublic && !isVideoAuthor) {
            return Result.Error("You cannot access this resource");
        }

        return Result.Ok("User can access to this video");
    }
}
