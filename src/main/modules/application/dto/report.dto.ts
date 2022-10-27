import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ReportReason } from "../../domain/models/report.model";

export class ReportRequestDto {
    @IsNotEmpty()
    @IsEnum(ReportReason)
    reason: ReportReason;

    @IsOptional()
    details: string;
}

export class ReportDto extends ReportRequestDto {
    @IsNotEmpty()
    @IsString()
    videoId: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    state?: number;
}
