export enum ReportReason {
    NSFW_CONTENT = "NSFW_CONTENT",
    VIOLENCE_BULLING = "VIOLENCE_BULLING",
    DANGEROUS_ACT = "DANGEROUS_ACT",
    SPAM = "SPAM",
    CHILD_ABUSE = "CHILD_ABUSE",
    OTHER = "OTHER"
}

export class Report {
    /**
     * Slug of the video that is reported
     */
    videoId: string;
    /**
     * id of the user that report the video
     */
    userId: string;

    reason: ReportReason;

    details: string;

    /**
     * State of the report
     * 0: pending
     * 1: accepted
     * -1: rejected
     */
    state?: number;
}
