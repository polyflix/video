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
        const entity = new Watchtime();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: Watchtime): WatchtimeDto {
        const watchtime = new WatchtimeDto();
        Object.assign(watchtime, entity);
        return watchtime;
    }
}
