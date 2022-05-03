import { Pagination } from "../../../core/types/pagination.type";
import { IsOptional, IsString } from "class-validator";

export const DefaultVideoParams: VideoParams = {
    page: 1,
    pageSize: 10
    //visibility: Visibility.PUBLIC
};

export class VideoParams extends Pagination {
    //todo add other filter param here

    @IsString()
    @IsOptional()
    slug?: string;

    /*@IsEnum(Visibility)
    @IsOptional()
    visibility?: Visibility;*/

    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    minViews?: number;

    @IsOptional()
    maxViews?: number;
}
