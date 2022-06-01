import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Video, VideoProps } from "../../../domain/models/video.model";
import { VideoEntity } from "../repositories/entities/video.entity";
import { UserEntityMapper } from "./user.entity.mapper";
import { WatchtimeEntityMapper } from "./watchtime.entity.mapper";

@Injectable()
export class VideoEntityMapper extends AbstractMapper<VideoEntity, Video> {
    constructor(
        private readonly watchtimeEntityMapper: WatchtimeEntityMapper,
        private readonly userEntityMapper: UserEntityMapper
    ) {
        super();
    }

    apiToEntity(apiModel: Video): VideoEntity {
        const entity: VideoEntity = {
            id: apiModel.id,
            slug: apiModel.slug,
            title: apiModel.title,
            description: apiModel.description,
            thumbnail: apiModel.thumbnail,
            publisherId: apiModel.publisher?.id,
            visibility: apiModel.visibility,
            draft: apiModel.draft,
            likes: apiModel.likes,
            views: apiModel.views,
            sourceType: apiModel.sourceType,
            source: apiModel.source
        };
        return Object.assign(new VideoEntity(), entity);
    }

    entityToApi(entity: VideoEntity): Video {
        const videoProps: VideoProps = {
            id: entity.id,
            slug: entity.slug,
            title: entity.title,
            description: entity.description,
            thumbnail: entity.thumbnail,
            publisher: this.userEntityMapper.entityToApi(entity.publisher),
            visibility: entity.visibility,
            draft: entity.draft,
            likes: entity.likes,
            views: entity.views,
            sourceType: entity.sourceType,
            source: entity.source,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };

        if (entity.watchtime) {
            videoProps.watchtime = this.watchtimeEntityMapper.entityToApi(
                entity.watchtime
            );
        }

        return Video.create(Object.assign(new VideoProps(), videoProps));
    }
}
