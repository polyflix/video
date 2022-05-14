import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { PresignedUrlResponse } from "src/main/core/types/presigned-url.type";
import {
    PresignedUrl,
    PresignedUrlProps
} from "src/main/modules/domain/models/presigned-url.entity";

@Injectable()
export class PresignedUrlApiMapper extends AbstractMapper<
    PresignedUrl,
    PresignedUrlResponse
> {
    apiToEntity(apiModel: PresignedUrlResponse): PresignedUrl {
        const presignedUrlProps: PresignedUrlProps = {
            tokenAccess: apiModel.tokenAccess
        };
        return PresignedUrl.create(
            Object.assign(new PresignedUrlProps(), presignedUrlProps)
        );
    }

    entityToApi(entity: PresignedUrl): PresignedUrlResponse {
        const presignedUrlResponse: PresignedUrlResponse = {
            tokenAccess: entity.tokenAccess
        };
        return Object.assign(new PresignedUrlResponse(), presignedUrlResponse);
    }
}
