import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty()
    page?: number;

    @IsNumber()
    @Min(1)
    @Max(2147483647)
    @Type(() => Number)
    @IsOptional()
    @ApiProperty()
    pageSize?: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    order?: string;
}
