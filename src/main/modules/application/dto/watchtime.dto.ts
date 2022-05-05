import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class WatchtimeDto {
    @IsNotEmpty()
    @IsString()
    videoId: string;

    userId: string;

    @IsNotEmpty()
    watchedSeconds: number;

    @IsNotEmpty()
    watchedPercent: number;

    @IsNotEmpty()
    @IsBoolean()
    isWatched: boolean;
}
