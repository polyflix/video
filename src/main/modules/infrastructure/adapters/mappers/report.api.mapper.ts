import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { ReportDto } from "../../../application/dto/report.dto";
import { Report } from "../../../domain/models/report.model";

@Injectable()
export class ReportApiMapper extends AbstractMapper<Report, ReportDto> {
    apiToEntity(apiModel: ReportDto): Report {
        const entity = new Report();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: Report): ReportDto {
        const report = new ReportDto();
        Object.assign(report, entity);
        return report;
    }
}
