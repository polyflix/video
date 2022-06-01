import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { UserDto } from "../../../application/dto/user.dto";
import { User, UserProps } from "../../../domain/models/user.model";

@Injectable()
export class UserApiMapper extends AbstractMapper<User, UserDto> {
    apiToEntity(apiModel: UserDto): User {
        const userProps: UserProps = {
            id: apiModel.id,
            avatar: apiModel.avatar,
            firstName: apiModel.firstName,
            lastName: apiModel.lastName
        };

        return User.create(Object.assign(new UserProps(), userProps));
    }

    entityToApi(entity: User): UserDto {
        const userDto: UserDto = {
            id: entity.id,
            avatar: entity.avatar,
            firstName: entity.firstName,
            lastName: entity.lastName
        };
        return Object.assign(new UserDto(), userDto);
    }
}
