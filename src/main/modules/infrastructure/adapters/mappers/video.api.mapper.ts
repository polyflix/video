import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { VideoResponse } from "../../../application/dto/video-response.dto";
import { Video, VideoProps } from "../../../domain/models/video.model";

@Injectable()
export class VideoApiMapper extends AbstractMapper<Video, VideoResponse> {
    apiToEntity(apiModel: VideoResponse): Video {
        const videoProps: VideoProps = {
            slug: apiModel.slug,
            title: apiModel.title,
            description: apiModel.description,
            thumbnail: apiModel.thumbnail,
            publisherId: apiModel.publisherId,
            visibility: apiModel.visibility,
            draft: apiModel.draft,
            likes: apiModel.likes,
            views: apiModel.views,
            sourceType: apiModel.sourceType,
            source: apiModel.source,
            createdAt: apiModel.createdAt,
            updatedAt: apiModel.updatedAt
        };
        return Video.create(Object.assign(new VideoProps(), videoProps));
    }

    entityToApi(entity: Video): VideoResponse {
        const video = new VideoResponse();
        return Object.assign(video, entity);
    }
}
