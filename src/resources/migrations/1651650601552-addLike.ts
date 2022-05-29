import { MigrationInterface, QueryRunner } from "typeorm";

export class addLike1651650601552 implements MigrationInterface {
    name = "addLike1651650601552";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "like" ("userId" character varying(64) NOT NULL, "videoId" character varying(64) NOT NULL, CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("userId", "videoId"))`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4b5e4d8b9889ba0889e2e923ea" ON "like" ("userId", "videoId") `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "video"."IDX_4b5e4d8b9889ba0889e2e923ea"`
        );
        await queryRunner.query(`DROP TABLE "like"`);
    }
}
