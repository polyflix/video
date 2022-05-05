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
        const entity = new WatchtimeEntity();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: WatchtimeEntity): Watchtime {
        const watchtime = new Watchtime();
        Object.assign(watchtime, entity);
        return watchtime;
    }
}
