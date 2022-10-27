import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { ReportRepository } from "../../../domain/ports/repositories/report.repository";
import { ReportEntity } from "./entities/report.entity";
import { Report } from "../../../domain/models/report.model";
import { ReportEntityMapper } from "../mappers/report.entity.mapper";
import { VideoEntity } from "./entities/video.entity";
import { Visibility } from "./entities/content.model";
import { ReportParams } from "../../filters/report.params";
import { ReportFilter } from "../../filters/report.filter";

export class PsqlReportRepository extends ReportRepository {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly reportRepo: Repository<ReportEntity>,
        private readonly reportEntityMapper: ReportEntityMapper,
        private readonly reportFilter: ReportFilter,
        private connection: Connection
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

    async manageReport(report: Report): Promise<Result<Report, Error>> {
        this.logger.log(
            `Update report from userId ${report.userId} for videoId ${report.videoId} for ${report.reason}`
        );

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const video = await queryRunner.manager.findOne(
                VideoEntity,
                report.videoId
            );

            const result = await queryRunner.manager.save(
                this.reportEntityMapper.apiToEntity(report)
            );

            // if report approved, video should be private, else it should be public
            if (report.state !== 0) {
                this.logger.log(
                    `Report ${
                        report.state === 1 ? "approved" : "rejected"
                    }, video ${video.slug} is now ${
                        report.state === 1 ? "private" : "public"
                    }`
                );
                await queryRunner.manager.update(
                    VideoEntity,
                    {
                        id: report.videoId
                    },
                    {
                        visibility:
                            report.state === 1
                                ? Visibility.PRIVATE
                                : Visibility.PUBLIC
                    }
                );
            }

            await queryRunner.commitTransaction();
            return Result.Ok(this.reportEntityMapper.entityToApi(result));
        } catch (e) {
            await queryRunner.rollbackTransaction();

            this.logger.error(
                `Can't manage report for video ${report.videoId}: ${e}`
            );
            return Result.Error(e);
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(videoId: string, userId: string): Promise<Option<Report>> {
        this.logger.log(
            `Find the report of user ${userId} for video ${videoId}`
        );
        try {
            const result = await this.reportRepo.findOne({
                where: {
                    videoId,
                    userId
                }
            });
            if (result) {
                return Option.Some(this.reportEntityMapper.entityToApi(result));
            } else {
                return Option.None();
            }
        } catch (e) {
            return Option.None();
        }
    }

    async findAll(params: ReportParams): Promise<Option<Report[]>> {
        const queryBuilder = this.reportRepo.createQueryBuilder("report");

        queryBuilder.leftJoinAndMapOne(
            "report.video",
            "report.video",
            "video",
            "video.id = report.videoId"
        );

        this.reportFilter.buildFilters(queryBuilder, params);
        this.reportFilter.buildPaginationAndSort(queryBuilder, params);

        const results = await queryBuilder.getMany();
        if (results.length === 0) {
            return Option.None();
        }

        return Option.Some(results.map(this.reportEntityMapper.entityToApi));
    }

    async count(params: ReportParams): Promise<number> {
        const queryBuilder = this.reportRepo.createQueryBuilder("report");
        this.reportFilter.totalCount(queryBuilder, params);
        const count = await queryBuilder.getCount();

        return count || 0;
    }
}
