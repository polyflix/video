import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    userId: string;

    @Column({ type: "text" })
    avatar: string;

    @Column({ type: "text" })
    firstName: string;

    @Column({ type: "text" })
    lastName: string;
}
