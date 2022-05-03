import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";
import { kafkaConfig, KAFKA_CLIENT } from "src/main/config/kafka.config";

@Global()
@Module({
    providers: [
        {
            provide: KAFKA_CLIENT,
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create(
                    kafkaConfig(configService.get("kafka"))
                );
            },
            inject: [ConfigService]
        }
    ],

    exports: [KAFKA_CLIENT]
})
export class KafkaModule {}
