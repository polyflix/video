import { Pagination } from "../../../core/types/pagination.type";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Visibility } from "../adapters/repositories/entities/content.model";

export const DefaultVideoParams: VideoParams = {
    page: 1,
    pageSize: 10,
    visibility: Visibility.PUBLIC
};

export class VideoParams extends Pagination {
    @IsString()
    @IsOptional()
    slug?: string;

    @IsEnum(Visibility)
    @IsOptional()
    visibility?: Visibility;

    @IsOptional()
    draft?: boolean;

    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    minViews?: number;

    @IsOptional()
    maxViews?: number;

    @IsOptional()
    authorId?: string;
}
