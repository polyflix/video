import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Pagination } from "../../../core/types/pagination.type";
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

    @IsString()
    @IsOptional()
    title?: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    minViews?: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    maxViews?: number;

    @IsOptional()
    authorId?: string;
}
