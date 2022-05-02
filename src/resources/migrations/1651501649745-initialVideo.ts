import { MigrationInterface, QueryRunner } from "typeorm";

export class initialVideo1651501649745 implements MigrationInterface {
    name = "initialVideo1651501649745";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "video" ("slug" character varying(64) NOT NULL, "description" text NOT NULL, "likes" integer NOT NULL, "views" integer NOT NULL, "thumbnail" text NOT NULL, CONSTRAINT "PK_11c248abdf3cf9cdafabccab429" PRIMARY KEY ("slug"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "video"`);
    }
}
