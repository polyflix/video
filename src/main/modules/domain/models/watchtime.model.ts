export class Watchtime {
    /**
     * Slug of the video that is liked
     */
    videoId: string;

    /**
     * id of the user that liked the video
     */
    userId?: string;

    /**
     * watchtime in seconds
     */
    watchedSeconds: number;

    /**
     * watchtime in percent between 0 and 1
     */
    watchedPercent: number;

    /**
     * true if video is watched by user
     */
    isWatched: boolean;
}
