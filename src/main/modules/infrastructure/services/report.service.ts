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
}
