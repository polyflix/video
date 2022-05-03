import { IsOptional } from "class-validator";
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn
} from "typeorm";

export abstract class BaseModel {
    @IsOptional({ always: true })
    @PrimaryGeneratedColumn("uuid")
    id?: string;

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