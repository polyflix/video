import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectMinioClient, MinioClient } from "@svtslv/nestjs-minio";
import {
    GET_PRESIGNED_URL_EXPIRY,
    MINIO_BUCKETS,
    PUT_PRESIGNED_URL_EXPIRY
} from "../../../core/constants/presignedUrl.constant";
import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";
import { PresignedUrl } from "../../domain/models/presigned-url.entity";

@Injectable()
export class TokenService {
    private readonly logger = new Logger(this.constructor.name);
    constructor(
        @InjectMinioClient() private readonly minioClient: MinioClient,
        private readonly configService: ConfigService
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

    async putVideoPresignedUrl(
        videoSlug: string,
        filename: string
    ): Promise<PresignedUrl> {
        return this.putPresignedUrl(
            MINIO_BUCKETS.VIDEO,
            `${videoSlug}/${filename}`
        );
    }

    async putThumbnailPresignedUrl(
        videoSlug: string,
        filename: string
    ): Promise<PresignedUrl> {
        return this.putPresignedUrl(
            MINIO_BUCKETS.IMAGE,
            `${videoSlug}/${filename}`
        );
    }

    private minioErrorHandler(err): null {
        this.logger.error(err, TokenService.name);
        if (err.code === "NoSuchBucket") {
            throw new NotFoundException(`Invalid bucketName requested`);
        }

        throw new Error(err);
    }

    private async putPresignedUrl(
        bucketName: MINIO_BUCKETS,
        path: string
    ): Promise<PresignedUrl> {
        this.logger.log(
            `Create PUT PSU for bucket ${bucketName} at path ${path}`
        );
        const psu: string = await this.minioClient
            .presignedPutObject(bucketName, path, PUT_PRESIGNED_URL_EXPIRY)
            .catch((err) => {
                return this.minioErrorHandler(err);
            });

        this.logger.log(`psu ${psu}`);

        return PresignedUrl.create({ tokenAccess: psu });
    }

    public getMinioBaseUri(type: "internal" | "external") {
        const { host, port, ssl } = this.configService.get(
            `minio.environment.${type}`
        );
        const protocol = ssl === "true" ? "https" : "http";
        const baseUri = `${protocol}://${host}`;
        if (+port) {
            return `${baseUri}:${+port}`;
        }
        return baseUri;
    }
}
