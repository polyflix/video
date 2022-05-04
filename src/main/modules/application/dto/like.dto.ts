import { IsNotEmpty, IsString } from "class-validator";

export class LikeDto {
    @IsNotEmpty()
    @IsString()
    videoId: string;

    @IsNotEmpty()
    @IsString()
    userId: string;
}
