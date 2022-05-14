import { PresignedUrlInvalidError } from "../errors/presigned-url-invalid.error";
import { Result } from "@swan-io/boxed";
import { Video, VideoSource } from "./video.model";

export type VideoPSU = {
    thumbnailPutPsu?: PresignedUrl;
    videoPutPsu?: PresignedUrl;
};

export class PresignedUrlProps {
    tokenAccess: string;
}

export class PresignedUrl {
    private constructor(public tokenAccess: string) {}

    static create(props: PresignedUrlProps): PresignedUrl {
        const video = new PresignedUrl(props.tokenAccess);

        return video.validate().match({
            Ok: () => video,
            Error: (e) => {
                throw new PresignedUrlInvalidError(e);
            }
        });
    }

    private validate(): Result<string, string> {
        return Result.Ok("Model Valid");
    }

    static canGenerateVideoToken(video: Video): Result<string, string> {
        if (video.sourceType !== VideoSource.INTERNAL) {
            Result.Error("Cannot get a token from an internal video");
        }
        return Result.Ok("Can get token");
    }
}
