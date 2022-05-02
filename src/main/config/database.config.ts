import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ISLOCAL } from "./loader.config";
import { resolve } from "path";
import { writeFileSync } from "fs";

export const configureTypeORM = (
    configService: ConfigService
): TypeOrmModuleOptions => {
    const config: TypeOrmModuleOptions = {
        type: "postgres",
        host: configService.get("database.psql.host"),
        port: configService.get("database.psql.port"),
        username: configService.get("database.psql.username"),
        password: configService.get("database.psql.password"),
        database: configService.get("database.psql.database"),
        synchronize: ISLOCAL,
        migrationsTableName: "migrations",
        entities: ["dist/**/*.entity.js"],
        logging: configService.get("database.psql.debug") === "true",
        cli: {
            migrationsDir: "src/resources/migrations"
        },
        autoLoadEntities: true
    };

    // Write TypeORM json config
    const path = resolve("ormconfig.json");
    writeFileSync(
        path,
        JSON.stringify({
            ...config,
            entities: ["src/**/*.entity.ts"],
            migrations: ["src/resources/migrations/*.ts"]
        })
    );

    return config;
};
