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
        type: "uuid"
    })
    @JoinColumn({ name: "userId" })
    userId: string;

    @PrimaryColumn()
    videoId: string;

    @ManyToOne(() => VideoEntity, (video) => video.id, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "videoId" })
    video?: Promise<VideoEntity>;
}
