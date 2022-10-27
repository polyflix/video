import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { MeId, Roles } from "@polyflix/x-utils";
import { ReportDto, ReportRequestDto } from "../../application/dto/report.dto";
import { ReportService } from "../services/report.service";
import { Span } from "nestjs-otel";
import { Role } from "@polyflix/x-utils/dist/types/roles.enum";
import { Paginate } from "../../../core/types/pagination.dto";
import { ReportApiMapper } from "../adapters/mappers/report.api.mapper";
import { ReportParams } from "../filters/report.params";

@Controller("videos/")
export class ReportVideoController {
    constructor(
        private readonly reportService: ReportService,
        private readonly reportApiMapper: ReportApiMapper
    ) {}

    @Post(":slug/report")
    @Span("REPORT_CONTROLLER_REPORT")
    async report(
        @MeId() meId: string,
        @Param("slug") slug: string,
        @Body() reportRequest: ReportRequestDto
    ): Promise<ReportDto> {
        const reportDto = {
            ...reportRequest,
            userId: meId,
            videoId: slug,
            state: 0
        };
        return await this.reportService.report(reportDto);
    }

    @Put(":videoId/report/:userId")
    @Span("REPORT_CONTROLLER_UPDATE")
    @Roles(Role.Admin)
    async update(
        @Param("videoId") videoId: string,
        @Param("userId") userId: string,
        @Body("state") stateUpdate: number
    ): Promise<ReportDto> {
        const reportDto = { videoId, userId, state: stateUpdate };
        return await this.reportService.update(reportDto);
    }

    @Get("report/list")
    @Roles(Role.Admin)
    async findAll(@Query() query: ReportParams): Promise<Paginate<ReportDto>> {
        const result = await this.reportService.findAll(query);
        return {
            items: result.map(this.reportApiMapper.entityToApi),
            totalCount: await this.reportService.count(query)
        };
    }
}
