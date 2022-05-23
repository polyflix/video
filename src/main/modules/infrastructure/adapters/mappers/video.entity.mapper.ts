import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Video, VideoProps } from "../../../domain/models/video.model";
import { VideoEntity } from "../repositories/entities/video.entity";
import { WatchtimeEntityMapper } from "./watchtime.entity.mapper";

@Injectable()
export class VideoEntityMapper extends AbstractMapper<VideoEntity, Video> {
    constructor(private readonly watchtimeEntityMapper: WatchtimeEntityMapper) {
        super();
    }

    apiToEntity(apiModel: Video): VideoEntity {
        const entity: VideoEntity = {
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
            source: apiModel.sourceId
        };
        return Object.assign(new VideoEntity(), entity);
    }

    entityToApi(entity: VideoEntity): Video {
        const videoProps: VideoProps = {
            slug: entity.slug,
            title: entity.title,
            description: entity.description,
            thumbnail: entity.thumbnail,
            publisherId: entity.publisherId,
            visibility: entity.visibility,
            draft: entity.draft,
            likes: entity.likes,
            views: entity.views,
            sourceType: entity.sourceType,
            source: entity.source,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };

        if (entity.watchtimes) {
            videoProps.watchtime = this.watchtimeEntityMapper.entityToApi(
                entity.watchtime
            );
        }

        return Video.create(Object.assign(new VideoProps(), videoProps));
    }
}
