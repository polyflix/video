import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";
import { VideoSource } from "../../domain/models/video.model";
import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";
import { Watchtime } from "../../domain/models/watchtime.model";

export type VideoPsuResponse = {
    thumbnailPutPsu?: PresignedUrlResponse;
    videoPutPsu?: PresignedUrlResponse;
};

export class VideoResponse {
    slug: string;

    title: string;

    description: string;

    thumbnail: string;

    publisherId?: string;

    visibility: Visibility;

    draft: boolean;

    likes?: number;

    views?: number;

    // tags?: Tag[];

    // attachments?: Attachment[];

    // availableLanguages?: SubtitleLanguages[];

    sourceType?: VideoSource;

    source: string;

    watchtime: Watchtime;

    createdAt?: Date;

    updatedAt?: Date;
}
