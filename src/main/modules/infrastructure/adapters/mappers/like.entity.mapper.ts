import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { LikeEntity } from "../repositories/entities/like.entity";
import { Like } from "../../../domain/models/like.model";

@Injectable()
export class LikeEntityMapper extends AbstractMapper<LikeEntity, Like> {
    apiToEntity(apiModel: Like): LikeEntity {
        const entity = new LikeEntity();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: LikeEntity): Like {
        const like = new Like();
        Object.assign(like, entity);
        return like;
    }
}
