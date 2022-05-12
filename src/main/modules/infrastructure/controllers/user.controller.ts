import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import {
    InjectKafkaClient,
    PolyflixKafkaValue,
    TriggerType
} from "@polyflix/x-utils";
import { UserDto } from "../../application/dto/user.dto";
import { UserService } from "../services/user.service";

//todo change message format send by the legacy to fit PolyflixKafkaValue
interface PolyflixCustomKafkaValue extends PolyflixKafkaValue {
    fields: any;
}

@Controller()
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
        private readonly userService: UserService
    ) {}

    @EventPattern("polyflix.legacy.user")
    async process(@Payload("value") message: PolyflixCustomKafkaValue) {
        const payload = message.fields;
        this.logger.log(
            `Receive message from topic: polyflix.legacy.user - trigger: ${message.trigger}`
        );
        const user: UserDto = Object.assign(new UserDto(), payload);
        switch (message.trigger) {
            case TriggerType.UPDATE:
                await this.userService.updateUser(user);
                break;
            case TriggerType.CREATE:
                await this.userService.createUser(user);
                break;
        }
    }
}
