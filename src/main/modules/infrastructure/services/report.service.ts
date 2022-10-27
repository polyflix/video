import {
    Injectable,
    Logger,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { LikeApiMapper } from "../adapters/mappers/like.api.mapper";
import { ReportDto } from "../../application/dto/report.dto";
import { ReportRepository } from "../../domain/ports/repositories/report.repository";
import { Report, ReportReason } from "../../domain/models/report.model";

@Injectable()
export class ReportService {
    protected readonly logger = new Logger(ReportService.name);
    constructor(
        private readonly likeApiMapper: LikeApiMapper,
        private readonly reportRepository: ReportRepository,
        private readonly videoService: VideoService
    ) {}

    async report(report: ReportDto): Promise<Report> {
        const video = await this.videoService.findOne(report.videoId);
        if (!video) {
            throw new NotFoundException();
        }

        // check if reason of report is correct
        if (!Object.values(ReportReason).includes(report.reason)) {
            this.logger.error(`Invalid report reason: ${report.reason}`);
            throw new UnprocessableEntityException(
                report,
                `Invalid report reason: ${report.reason}`
            );
        }

        const result = await this.reportRepository.report({
            ...report,
            videoId: video.id
        });

        return result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });
    }

    async update(report: Partial<ReportDto>): Promise<Report> {
        const model = await this.reportRepository.findOne(
            report.videoId,
            report.userId
        );

        const reportDb = model.match({
            Some: (value) => value,
            None: () => null
        });

        if (!reportDb) {
            throw new NotFoundException();
        }

        this.logger.log(
            `Update report on ${report.videoId} from ${report.userId} to ${report.state}`
        );

        const result = await this.reportRepository.manageReport({
            ...reportDb,
            state: report.state
        });

        //todo in an other issue, if value of result exists and state is 1, send email to video owner to explain that his video is now private due to a report

        return result.match({
            Ok: (value) => value,
            Error: (e) => {
                throw new NotFoundException(e);
            }
        });
    }
}
