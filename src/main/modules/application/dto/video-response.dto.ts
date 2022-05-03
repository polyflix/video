import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";
import { VideoSource } from "../../domain/models/video.model";

export class VideoResponse {
    id: string;

    slug: string;

    title: string;

    description: string;

    thumbnail: string;

    publishedId?: string;

    visibility: Visibility;

    draft: boolean;

    likes?: number;

    views?: number;

    // userMeta?: UserVideoMeta;

    // tags?: Tag[];

    // attachments?: Attachment[];

    // availableLanguages?: SubtitleLanguages[];

    sourceType?: VideoSource;

    source?: string;

    createdAt?: Date;

    updatedAt?: Date;
}
