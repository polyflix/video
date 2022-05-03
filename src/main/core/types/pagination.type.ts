import { Type } from "class-transformer";
import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
} from "class-validator";

export class Pagination {
    @IsInt()
    @Min(1)
    @Max(2147483647)
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @IsOptional()
    pageSize?: number;

    @IsString()
    @IsOptional()
    order?: string;
}
