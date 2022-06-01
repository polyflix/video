import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { UserEntity } from "../repositories/entities/user.entity";
import { User, UserProps } from "../../../domain/models/user.model";

@Injectable()
export class UserEntityMapper extends AbstractMapper<UserEntity, User> {
    apiToEntity(apiModel: User): UserEntity {
        const userEntity: UserEntity = {
            userId: apiModel.id,
            avatar: apiModel.avatar,
            firstName: apiModel.firstName,
            lastName: apiModel.lastName
        };
        return Object.assign(new UserEntity(), userEntity);
    }

    entityToApi(entity: UserEntity): User {
        const userProps: UserProps = {
            id: entity.userId,
            avatar: entity.avatar,
            firstName: entity.firstName,
            lastName: entity.lastName
        };

        return User.create(Object.assign(new UserProps(), userProps));
    }
}
