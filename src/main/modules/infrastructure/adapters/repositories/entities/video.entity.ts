import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("video")
export class VideoEntity {
    @PrimaryColumn({
        type: "varchar",
        length: 64
    })
    slug: string;

    @Column({ type: "text" })
    description: string;

    @Column({ zerofill: true })
    likes: number;

    @Column({ zerofill: true })
    views: number;

    @Column({ type: "text" })
    thumbnail: string;
}
