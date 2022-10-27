import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";
import { Report } from "../../models/report.model";

export abstract class ReportRepository {
    protected readonly logger = new Logger(this.constructor.name);

    abstract report(report: Report): Promise<Result<Report, Error>>;

    abstract manageReport(report: Report): Promise<Result<Report, Error>>;

    abstract findOne(videoId: string, userId: string): Promise<Option<Report>>;
}
