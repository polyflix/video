import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { WatchtimeEntity } from "../repositories/entities/watchtime.entity";
import { Watchtime } from "../../../domain/models/watchtime.model";
import { has } from "lodash";
@Injectable()
export class WatchtimeEntityMapper extends AbstractMapper<
    WatchtimeEntity,
    Watchtime
> {
    apiToEntity(apiModel: Watchtime): WatchtimeEntity {
        const entity: WatchtimeEntity = {
            userId: apiModel.userId,
            videoId: apiModel.videoId,
            watchedPercent: apiModel.watchedPercent,
            watchedSeconds: apiModel.watchedSeconds
        };
        if (has(apiModel, "isWatched")) {
            entity.isWatched = apiModel.isWatched;
        }
        return Object.assign(new WatchtimeEntity(), entity);
    }

    entityToApi(entity: WatchtimeEntity): Watchtime {
        const watchtime: Watchtime = {
            videoId: entity.videoId,
            watchedPercent: entity.watchedPercent,
            watchedSeconds: entity.watchedSeconds,
            isWatched: entity.isWatched,
            userId: entity.userId
        };
        return Object.assign(new Watchtime(), watchtime);
    }
}
