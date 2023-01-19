import { IsOptional, Matches } from "class-validator";
import { Column } from "typeorm";
import { BaseModel } from "./base.model";

export enum Visibility {
    PUBLIC = "public",
    PROTECTED = "protected",
    PRIVATE = "private"
}

export class ContentModel extends BaseModel {
    @Matches(
        `^${Object.values(Visibility)
            .filter((v) => typeof v !== "number")
            .join("|")}$`,
        "i"
    )
    @IsOptional({ always: true })
    @Column({ enum: Visibility, type: "enum", default: Visibility.PUBLIC })
    visibility?: Visibility;
}
