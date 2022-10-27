import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Report } from "../../../domain/models/report.model";
import { ReportEntity } from "../repositories/entities/report.entity";

@Injectable()
export class ReportEntityMapper extends AbstractMapper<ReportEntity, Report> {
    apiToEntity(apiModel: Report): ReportEntity {
        const entity = new ReportEntity();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: ReportEntity): Report {
        const report = new Report();
        Object.assign(report, entity);
        return report;
    }
}
