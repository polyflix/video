import { Option, Result } from "@swan-io/boxed";
import { VideoInvalidError } from "../errors/video-invalid.error";

const YOUTUBE_MATCH_REGEX =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

const isSourceValid = (source: string): boolean => {
    if (isYoutubeVideo(source)) return true;
    else return /^.+[.]mp4$/.test(source);
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

export enum VideoSource {
    YOUTUBE = "youtube",
    INTERNAL = "internal",
    UNKNOWN = "unknown"
}

export class VideoProps {
    /**
     * This is an unique slug for the video
     */
    slug: string;

    /**
     * Description of the video, it can contain a lot of data
     */
    description: string;

    /**
     * Number of likes for a video
     */
    likes: number;

    /**
     * Number of views for a video
     */
    views: number;

    thumbnail: string;

    src: string;

    source: string;

    sourceType: string;
}

export class Video {
    private constructor(
        public slug: string,
        public description: string,
        public likes: number,
        public views: number,
        public thumbnail: string,
        public src: string,
        public source: string,
        public sourceType: string
    ) {}

    static create(props: VideoProps): Video {
        const video = new Video(
            props.slug,
            props.description,
            props.likes,
            props.views,
            props.thumbnail,
            props.src,
            props.source,
            props.sourceType
        );

        return video.validate().match({
            Ok: () => video,
            Error: (e) => {
                throw new VideoInvalidError(e);
            }
        });
    }

    //todo uncomment when field will be added to entity
    //todo add field: src, sourceType, source to entity
    private validate(): Result<string, string> {
        if (this.src && this.thumbnail) {
            return Result.Error("No source or thumbnail specified");
        }
        /*if (!isSourceValid(this.src)) {
            return Result.Error("This video source is not yet allowed");
        }*/
        if (!isThumbnailValid(this.thumbnail)) {
            return Result.Error("This thumbnail format is not yet allowed");
        }
        /*if (this.sourceType === VideoSource.YOUTUBE && !isFile(this.src)) {
            return Result.Error("This thumbnail format is not yet allowed");
        }
        if (
            this.sourceType === VideoSource.YOUTUBE &&
            !isFile(this.thumbnail)
        ) {
            return Result.Error("Source thumbnail should be a local file name");
        }*/
        return Result.Ok("Model Valid");
    }
}
