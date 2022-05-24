import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { WatchtimeEntity } from "../repositories/entities/watchtime.entity";
import { Watchtime } from "../../../domain/models/watchtime.model";

@Injectable()
export class WatchtimeEntityMapper extends AbstractMapper<
    WatchtimeEntity,
    Watchtime
> {
    apiToEntity(apiModel: Watchtime): WatchtimeEntity {
        const entity: WatchtimeEntity = {
            userId: apiModel.userId,
            isWatched: apiModel.isWatched,
            videoSlug: apiModel.videoId,
            watchedPercent: apiModel.watchedPercent,
            watchedSeconds: apiModel.watchedSeconds
        };
        return Object.assign(new WatchtimeEntity(), entity);
    }

    entityToApi(entity: WatchtimeEntity): Watchtime {
        const watchtime: Watchtime = {
            videoId: entity.videoSlug,
            watchedPercent: entity.watchedPercent,
            watchedSeconds: entity.watchedSeconds,
            isWatched: entity.isWatched,
            userId: entity.userId
        };
        return Object.assign(new Watchtime(), watchtime);
    }
}
