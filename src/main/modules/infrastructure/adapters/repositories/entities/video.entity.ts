import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { VideoSource } from "../../../../domain/models/video.model";
import { BaseModel } from "./base.model";
import { Visibility } from "./content.model";
import { WatchtimeEntity } from "./watchtime.entity";

@Entity("video")
export class VideoEntity extends BaseModel {
    @Column({ type: "text" })
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "text" })
    thumbnail: string;

    @Column({ default: 0 })
    likes: number;

    @Column({ default: 0 })
    views: number;

    @Column("uuid")
    publisherId?: string;

    @Column({ enum: Visibility, type: "enum", default: Visibility.PUBLIC })
    visibility?: Visibility;

    @Column({ default: false })
    draft?: boolean;

    @Column({ enum: VideoSource, type: "enum" })
    sourceType: VideoSource;

    @Column()
    source: string;

    @OneToMany(() => WatchtimeEntity, (watchtime) => watchtime.video)
    @JoinColumn({ name: "watchtimes" })
    watchtimes?: WatchtimeEntity[];

    watchtime?: WatchtimeEntity;
}
