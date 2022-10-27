import { IsNotEmpty, IsString } from "class-validator";
import { ReportReason } from "../../domain/models/report.model";

export class ReportRequestDto {
    reason: ReportReason;

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
