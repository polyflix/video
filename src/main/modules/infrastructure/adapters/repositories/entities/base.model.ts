import { IsOptional } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Index,
    PrimaryColumn,
    UpdateDateColumn,
    VersionColumn
} from "typeorm";

export abstract class BaseModel {
    @PrimaryColumn({
        type: "uuid"
    })
    id: string;

    @Column({ unique: true })
    @Index()
    slug: string;

    @IsOptional({ always: true })
    @CreateDateColumn()
    createdAt?: Date;

    @IsOptional({ always: true })
    @UpdateDateColumn()
    updatedAt?: Date;

    @IsOptional({ always: true })
    @VersionColumn({ default: 1 })
    __v?: number;
}
