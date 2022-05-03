import { BaseModel } from "./base.model";
import { IsBoolean, IsOptional, Matches } from "class-validator";
import { Column } from "typeorm";

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

    @IsBoolean()
    @IsOptional({ always: true })
    @Column({ default: false })
    draft?: boolean;
}
