import { Column, Entity, PrimaryColumn } from "typeorm";
import { BaseModel } from "./base.model";

@Entity("video")
export class VideoEntity extends BaseModel {
    @Column({ type: "text" })
    description: string;

    @Column({ zerofill: true })
    likes: number;

    @Column({ zerofill: true })
    views: number;

    @Column({ type: "text" })
    thumbnail: string;
}
