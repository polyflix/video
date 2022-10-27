import { Body, Controller, Param, Post } from "@nestjs/common";
import { MeId } from "@polyflix/x-utils";
import { ReportRequestDto } from "../../application/dto/report.dto";
import { ReportService } from "../services/report.service";
import { Span } from "nestjs-otel";

@Controller("videos/")
export class ReportVideoController {
    constructor(private readonly reportService: ReportService) {}

    @Post(":slug/report")
    @Span("REPORT_CONTROLLER_REPORT")
    async report(
        @MeId() meId: string,
        @Param("slug") slug: string,
        @Body() reportRequest: ReportRequestDto
    ): Promise<void> {
        const reportDto = { ...reportRequest, userId: meId, videoId: slug };
        await this.reportService.report(reportDto);
    }
}
