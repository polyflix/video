import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import { VideoEntity } from "./video.entity";

@Entity("watchtime")
@Index(["userId", "videoSlug"], { unique: true })
export class WatchtimeEntity {
    @PrimaryColumn({
        type: "varchar"
    })
    userId: string;

    @PrimaryColumn({
        type: "varchar"
    })
    videoSlug: string;

    @Column({ type: "float" })
    watchedSeconds: number;

    @Column({ type: "float" })
    watchedPercent: number;

    @Column({ type: "boolean", default: false })
    isWatched?: boolean;

    @ManyToOne(() => VideoEntity, (video) => video.watchtimes, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoSlug" })
    video?: VideoEntity;
}
