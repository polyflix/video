import {
    BaseEntity,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import { VideoEntity } from "./video.entity";

@Entity("like")
@Index(["userId", "videoId"], { unique: true })
export class LikeEntity extends BaseEntity {
    @PrimaryColumn({
        type: "varchar"
    })
    userId: string;

    @PrimaryColumn({
        type: "varchar"
    })
    videoId: string;

    @ManyToOne(() => VideoEntity, (video) => video.slug, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoId" })
    video?: Promise<VideoEntity>;
}
