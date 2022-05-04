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
        type: "varchar",
        length: 64
    })
    userId: string;

    @PrimaryColumn({
        type: "varchar",
        length: 64
    })
    videoId: string;

    @ManyToOne(() => VideoEntity, (video) => video.slug, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoId" })
    video?: Promise<VideoEntity>;
}
