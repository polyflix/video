import { IsOptional } from "class-validator";
import {
    CreateDateColumn,
    PrimaryColumn,
    UpdateDateColumn,
    VersionColumn
} from "typeorm";

export abstract class BaseModel {
    @PrimaryColumn({
        type: "varchar",
        length: 64
    })
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
