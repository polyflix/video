import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Watchtime } from "../../../domain/models/watchtime.model";
import { WatchtimeDto } from "../../../application/dto/watchtime.dto";

@Injectable()
export class WatchtimeApiMapper extends AbstractMapper<
    Watchtime,
    WatchtimeDto
> {
    apiToEntity(apiModel: WatchtimeDto): Watchtime {
        const watchtime: Watchtime = {
            videoId: apiModel.videoId,
            watchedPercent: apiModel.watchedPercent,
            watchedSeconds: apiModel.watchedSeconds,
            isWatched: apiModel.isWatched
        };
        return Object.assign(new Watchtime(), watchtime);
    }

    entityToApi(entity: Watchtime): WatchtimeDto {
        const watchtimeDto: WatchtimeDto = {
            isWatched: entity.isWatched,
            videoId: entity.videoId,
            watchedPercent: entity.watchedPercent,
            watchedSeconds: entity.watchedSeconds
        };
        return Object.assign(new WatchtimeDto(), watchtimeDto);
    }
}
