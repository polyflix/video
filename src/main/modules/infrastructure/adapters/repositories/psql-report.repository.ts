import { Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReportRepository } from "../../../domain/ports/repositories/report.repository";
import { ReportEntity } from "./entities/report.entity";
import { Report } from "../../../domain/models/report.model";
import { ReportEntityMapper } from "../mappers/report.entity.mapper";

export class PsqlReportRepository extends ReportRepository {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly reportRepo: Repository<ReportEntity>,
        private readonly reportEntityMapper: ReportEntityMapper
    ) {
        super();
    }

    async report(report: Report): Promise<Result<Report, Error>> {
        this.logger.log(
            `New report from userId ${report.userId} for videoId ${report.videoId} for ${report.reason}`
        );
        const reportEntity = this.reportEntityMapper.apiToEntity(report);

        try {
            await this.reportRepo.save(reportEntity);
            return Result.Ok(report);
        } catch (e) {
            return Result.Error(e);
        }
    }
}
