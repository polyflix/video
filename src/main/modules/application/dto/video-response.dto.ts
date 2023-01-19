import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";
import { VideoSource } from "../../domain/models/video.model";
import { Watchtime } from "../../domain/models/watchtime.model";
import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";
import { UserDto } from "./user.dto";

export type VideoPsuResponse = {
    thumbnailPutPsu?: PresignedUrlResponse;
    videoPutPsu?: PresignedUrlResponse;
};

export class VideoResponse {
    id: string;

    slug: string;

    title: string;

    description: string;

    thumbnail: string;

    publisher: UserDto;

    visibility: Visibility;

    likes?: number;

    views?: number;

    // tags?: Tag[];

    // attachments?: Attachment[];

    // availableLanguages?: SubtitleLanguages[];

    sourceType?: VideoSource;

    source: string;

    watchtime: Watchtime;

    isLiked?: boolean;

    createdAt?: Date;

    updatedAt?: Date;
}
