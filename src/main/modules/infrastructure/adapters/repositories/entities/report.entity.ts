import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import { VideoEntity } from "./video.entity";
import { ReportReason } from "../../../../domain/models/report.model";

@Entity("report")
@Index(["userId", "videoId"], { unique: true })
export class ReportEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    userId: string;

    @PrimaryColumn()
    videoId: string;

    @Column({ enum: ReportReason, type: "enum" })
    reason: ReportReason;

    @Column({ type: "text", default: "" })
    details: string;

    /**
     * State of the report
     * 0: pending
     * 1: accepted
     * -1: rejected
     */
    @Column({ default: 0 })
    state: number;

    @ManyToOne(() => VideoEntity, (video) => video.id, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoId" })
    video?: Promise<VideoEntity>;
}
