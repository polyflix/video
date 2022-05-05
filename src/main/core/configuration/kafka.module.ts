import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    KafkaModule as PolyflixKafkaModule,
    kafkaConfig
} from "@polyflix/x-utils";
@Global()
@Module({
    imports: [
        PolyflixKafkaModule.register({
            useFactory: (configService: ConfigService) => {
                return kafkaConfig(configService.get("kafka"));
            },
            inject: [ConfigService]
        })
    ],
    exports: [PolyflixKafkaModule]
})
export class KafkaModule {}
