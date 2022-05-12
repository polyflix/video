import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { UserEntity } from "../repositories/entities/user.entity";
import { User } from "../../../domain/models/user.model";

@Injectable()
export class UserEntityMapper extends AbstractMapper<UserEntity, User> {
    apiToEntity(apiModel: User): UserEntity {
        const user = new UserEntity();
        Object.assign(user, {
            userId: apiModel.id,
            avatar: apiModel.avatar,
            displayName: apiModel.displayName
        });
        return user;
    }

    entityToApi(entity: UserEntity): User {
        const props: User = {
            id: entity.userId,
            avatar: entity.avatar,
            displayName: entity.displayName
        };
        return Object.assign(
            new User(entity.userId, entity.avatar, entity.displayName),
            props
        );
    }
}
