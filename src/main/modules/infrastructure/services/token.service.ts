import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";
import {
    GET_PRESIGNED_URL_EXPIRY,
    MINIO_BUCKETS
} from "../../../core/constants/presignedUrl.constant";
import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";

@Injectable()
export class TokenService {
    private readonly logger = new Logger(this.constructor.name);
    constructor(
        @InjectMinioClient() private readonly minioClient: MinioClient
    ) {}

    async getPresignedUrl(
        bucketName: MINIO_BUCKETS,
        path: string
    ): Promise<PresignedUrlResponse> {
        const presignedUrl = await this.minioClient
            .presignedGetObject(bucketName, path, GET_PRESIGNED_URL_EXPIRY)
            .catch((err) => {
                return this.minioErrorHandler(err);
            });
        return { tokenAccess: presignedUrl };
    }

    private minioErrorHandler(err): null {
        this.logger.error(err, TokenService.name);
        if (err.code === "NoSuchBucket") {
            throw new NotFoundException(`Invalid bucketName requested`);
        }

        throw new Error(err);
    }
}
