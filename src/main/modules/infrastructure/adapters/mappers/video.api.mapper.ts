import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MINIO_BUCKETS } from "src/main/core/constants/presignedUrl.constant";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { VideoResponse } from "../../../application/dto/video-response.dto";
import {
    Video,
    VideoProps,
    VideoSource
} from "../../../domain/models/video.model";
import { TokenService } from "../../services/token.service";

@Injectable()
export class VideoApiMapper extends AbstractMapper<Video, VideoResponse> {
    constructor(
        private configService: ConfigService,
        private tokenService: TokenService
    ) {
        super();
    }

    apiToEntity(apiModel: Partial<VideoResponse>): Video {
        const videoProps: Partial<VideoProps> = {
            id: apiModel.id,
            title: apiModel.title,
            description: apiModel.description,
            thumbnail: apiModel.thumbnail,
            visibility: apiModel.visibility,
            draft: apiModel.draft,
            source: apiModel.source
        };
        if (apiModel.slug) {
            videoProps.slug = apiModel.slug;
        }
        if (apiModel.publisher) {
            videoProps.publisher = apiModel.publisher;
        }
        if (apiModel.likes) {
            videoProps.likes = apiModel.likes;
        }
        if (apiModel.views) {
            videoProps.views = apiModel.views;
        }
        if (apiModel.sourceType) {
            videoProps.sourceType = apiModel.sourceType;
        }
        if (apiModel.createdAt) {
            videoProps.createdAt = apiModel.createdAt;
        }
        if (apiModel.updatedAt) {
            videoProps.updatedAt = apiModel.updatedAt;
        }

        return Video.create(Object.assign(new VideoProps(), videoProps));
    }

    entityToApi(entity: Video): VideoResponse {
        const formatThumbnailUri = (): string => {
            if (entity.sourceType !== VideoSource.INTERNAL) {
                return entity.thumbnail;
            }
            const baseUri = this.tokenService.getMinioBaseUri("external");
            return `${baseUri}/${MINIO_BUCKETS.IMAGE}/${entity.thumbnail}`;
        };
        const video: VideoResponse = {
            id: entity.id,
            slug: entity.slug,
            title: entity.title,
            description: entity.description,
            thumbnail: formatThumbnailUri(),
            publisher: entity.publisher,
            visibility: entity.visibility,
            draft: entity.draft,
            likes: entity.likes,
            views: entity.views,
            sourceType: entity.sourceType,
            source: entity.source,
            watchtime: entity.watchtime,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
        return Object.assign(new VideoResponse(), video);
    }
}
