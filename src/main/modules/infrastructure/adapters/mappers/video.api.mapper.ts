import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { VideoResponse } from "../../../application/dto/video-response.dto";
import { Video, VideoProps } from "../../../domain/models/video.model";

@Injectable()
export class VideoApiMapper extends AbstractMapper<Video, VideoResponse> {
    apiToEntity(apiModel: VideoResponse): Video {
        // TODO WARN
        const entity = Video.create(Object.assign(new VideoProps(), apiModel));
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: Video): VideoResponse {
        const video = new VideoResponse();
        Object.assign(video, entity);
        return video;
    }
}
