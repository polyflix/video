export class Video {
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
}

export enum VideoSource {
    YOUTUBE = "youtube",
    INTERNAL = "internal",
    UNKNOWN = "unknown"
}