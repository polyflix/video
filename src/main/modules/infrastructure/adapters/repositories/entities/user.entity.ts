import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn()
    userId: string;

    @Column({ type: "text" })
    avatar: string;

    @Column({ type: "text" })
    displayName: string;
}
