import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Video, VideoProps } from "../../../domain/models/video.model";
import { VideoEntity } from "../repositories/entities/video.entity";

@Injectable()
export class VideoEntityMapper extends AbstractMapper<VideoEntity, Video> {
    apiToEntity(apiModel: Video): VideoEntity {
        const entity = new VideoEntity();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: VideoEntity): Video {
        // TODO WARN
        const videoProps: VideoProps = {
            likes: entity.likes,
            source: "",
            sourceType: "",
            src: "",
            thumbnail: entity.thumbnail,
            views: 0,
            slug: entity.slug,
            description: entity.description
        };
        const video = Video.create(videoProps);
        Object.assign(video, entity);
        return video;
    }
}
