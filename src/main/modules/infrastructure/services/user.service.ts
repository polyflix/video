import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/ports/repositories/user.repository";
import { UserApiMapper } from "../adapters/mappers/user.api.mapper";
import { UserDto } from "../../application/dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly userApiMapper: UserApiMapper,
        private readonly userRepository: UserRepository
    ) {}

    async updateUser(user: UserDto): Promise<void> {
        await this.userRepository.update(user.id, user);
    }

    async createUser(user: UserDto): Promise<void> {
        user.displayName = `${user["firstName"]} ${user["lastName"]}`;
        await this.userRepository.create(user);
    }
}
