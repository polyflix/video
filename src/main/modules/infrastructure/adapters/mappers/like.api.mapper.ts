import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { VideoResponse } from "../../../application/dto/video-response.dto";
import { Video } from "../../../domain/models/video.model";
import { Like } from "../../../domain/models/like.model";
import { LikeDto } from "../../../application/dto/like.dto";

@Injectable()
export class LikeApiMapper extends AbstractMapper<Like, LikeDto> {
    apiToEntity(apiModel: LikeDto): Like {
        const entity = new Like();
        Object.assign(entity, apiModel);
        return entity;
    }

    entityToApi(entity: Like): LikeDto {
        const like = new LikeDto();
        Object.assign(like, entity);
        return like;
    }
}
