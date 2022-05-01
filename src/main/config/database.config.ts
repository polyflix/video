import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { isLocal } from "./loader.config";
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
        database: configService.get("database.psqL.database"),
        synchronize: isLocal,
        migrationsTableName: "migrations",
        entities: ["dist/**/*.entity.js"],
        logging: configService.get("database.psql.debug") === "true",
        cli: {
            migrationsDir: "src/resources/migrations"
        }
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
