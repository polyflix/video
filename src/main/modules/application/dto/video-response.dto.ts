import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID
} from "class-validator";
import { ISLOCAL } from "src/main/config/loader.config";
import { Visibility } from "../../../core/models/content.model";
import { VideoSource } from "../../domain/models/video.model";

export class VideoResponse {
    @IsUUID("4")
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUrl({ require_tld: !ISLOCAL })
    @IsNotEmpty()
    thumbnail: string;

    @IsUUID("4")
    @IsString()
    publishedId?: string;

    @IsEnum(Visibility)
    @IsNotEmpty()
    visibility: Visibility;

    @IsBoolean()
    @IsNotEmpty()
    draft: boolean;

    @IsNumber()
    @IsOptional()
    likes?: number;

    @IsNumber()
    @IsOptional()
    views?: number;

    // userMeta?: UserVideoMeta;

    // tags?: Tag[];

    // attachments?: Attachment[];

    // availableLanguages?: SubtitleLanguages[];

    @IsEnum(VideoSource)
    @IsOptional()
    sourceType?: VideoSource;

    @IsString()
    @IsOptional()
    source?: string;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}
