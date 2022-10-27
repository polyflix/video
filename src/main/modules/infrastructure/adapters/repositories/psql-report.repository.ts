import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { ReportRepository } from "../../../domain/ports/repositories/report.repository";
import { ReportEntity } from "./entities/report.entity";
import { Report } from "../../../domain/models/report.model";
import { ReportEntityMapper } from "../mappers/report.entity.mapper";
import { VideoEntity } from "./entities/video.entity";
import { Visibility } from "./entities/content.model";

export class PsqlReportRepository extends ReportRepository {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly reportRepo: Repository<ReportEntity>,
        private readonly reportEntityMapper: ReportEntityMapper,
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

            if (report.state === 1) {
                this.logger.log(
                    `Report accepted, video ${video.slug} is now private`
                );
                await queryRunner.manager.update(
                    VideoEntity,
                    {
                        id: report.videoId
                    },
                    { visibility: Visibility.PRIVATE }
                );
            }

            await queryRunner.commitTransaction();
            return Result.Ok(result);
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
}
