import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { SelectQueryBuilder } from "typeorm";
import { AbstractFilter } from "../../../core/helpers/abstract.filter";
import { ReportEntity } from "../adapters/repositories/entities/report.entity";
import { ReportParams } from "./report.params";

@Injectable()
export class ReportFilter extends AbstractFilter<ReportEntity> {
    buildFilters(
        queryBuilder: SelectQueryBuilder<ReportEntity>,
        params: ReportParams
    ): void {
        if (has(params, "videoId")) {
            queryBuilder.andWhere("report.videoId = :videoId", {
                videoId: params.videoId
            });
        }

        if (has(params, "state")) {
            queryBuilder.andWhere("report.state = :state", {
                state: params.state
            });
        }

        if (has(params, "reason")) {
            queryBuilder.andWhere("report.reason = :reason", {
                reason: params.reason
            });
        }
    }

    buildPaginationAndSort(
        queryBuilder: SelectQueryBuilder<ReportEntity>,
        params: ReportParams
    ): void {
        this.paginate(queryBuilder, params.page, params.pageSize);

        this.order(
            "report",
            queryBuilder,
            has(params, "order") ? params.order : "videoId",
            ["videoId", "reason", "state"]
        );
    }

    totalCount(
        queryBuilder: SelectQueryBuilder<ReportEntity>,
        params: ReportParams
    ): void {
        this.buildFilters(queryBuilder, params);
        queryBuilder.select("COUNT(report.videoId) AS total");
    }
}
