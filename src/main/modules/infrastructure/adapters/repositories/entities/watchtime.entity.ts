import {
    BaseEntity,
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
export class WatchtimeEntity extends BaseEntity {
    @PrimaryColumn({
        type: "varchar",
        length: 64
    })
    userId: string;

    @PrimaryColumn({
        type: "varchar",
        length: 64
    })
    videoId: string;

    @Column({ type: "float" })
    watchedSeconds: number;

    @Column({ type: "float" })
    watchedPercent: number;

    @Column({ type: "boolean", default: false })
    isWatched: boolean;

    @ManyToOne(() => VideoEntity, (video) => video.slug, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoId" })
    video?: Promise<VideoEntity>;
}
