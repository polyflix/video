import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { VideoResponse } from "../../../application/dto/video-response.dto";
import { Video } from "../../../domain/models/video.model";
import { VideoEntity } from "../repositories/entities/video.entity";

@Injectable()
export class VideoEntityMapper extends AbstractMapper<VideoEntity, Video> {
    apiToEntity(apiModel: Video): VideoEntity {
        const entity = new VideoEntity();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: VideoEntity): Video {
        const video = new Video();
        Object.assign(video, entity);
        return video;
    }
}
