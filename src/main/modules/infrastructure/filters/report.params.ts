import { Pagination } from "../../../core/types/pagination.type";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Visibility } from "../adapters/repositories/entities/content.model";
import { Type } from "class-transformer";
import { ReportReason } from "../../domain/models/report.model";

export const DefaultReportParams: ReportParams = {
    page: 1,
    pageSize: 10
};

export class ReportParams extends Pagination {
    @IsString()
    @IsOptional()
    videoId?: string;

    @IsEnum(Visibility)
    @IsOptional()
    reason?: ReportReason;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    state?: number;
}
