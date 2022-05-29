import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserEntity1652298950667 implements MigrationInterface {
    name = "addUserEntity1652298950667";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" ("userId" character varying NOT NULL, "avatar" text NOT NULL, "displayName" text NOT NULL, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
