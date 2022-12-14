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
@Index(["userId", "videoId"], { unique: true })
export class WatchtimeEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    userId: string;

    @PrimaryColumn()
    videoId: string;

    @Column({ type: "float" })
    watchedSeconds: number;

    @Column({ type: "float" })
    watchedPercent: number;

    @Column({ type: "boolean", default: false })
    isWatched?: boolean;

    @ManyToOne(() => VideoEntity, (video) => video.watchtimes, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoId" })
    video?: VideoEntity;
}
