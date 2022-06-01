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

    async update(user: UserDto): Promise<void> {
        await this.userRepository.update(
            user.id,
            this.userApiMapper.apiToEntity(user)
        );
    }

    async create(user: UserDto): Promise<void> {
        await this.userRepository.create(this.userApiMapper.apiToEntity(user));
    }
}
