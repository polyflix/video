import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
} from "class-validator";

export class WatchtimeDto {
    @IsNotEmpty()
    @IsString()
    videoId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    watchedSeconds: number;

    @IsNumber()
    @Min(0)
    @Max(1)
    @IsNotEmpty()
    watchedPercent: number;

    @IsOptional()
    @IsBoolean()
    isWatched?: boolean;
}
