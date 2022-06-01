import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserEntity1654068233018 implements MigrationInterface {
    name = "updateUserEntity1654068233018";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "public"."user" DROP COLUMN "displayName"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."user" ADD "firstName" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."user" ADD "lastName" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."video" DROP COLUMN "publisherId"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."video" ADD "publisherId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."video" ADD CONSTRAINT "FK_0c9a79914d1fa8c4f30f7d3f2ff" FOREIGN KEY ("publisherId") REFERENCES "public"."user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "public"."video" DROP CONSTRAINT "FK_0c9a79914d1fa8c4f30f7d3f2ff"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."video" DROP COLUMN "publisherId"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."video" ADD "publisherId" uuid NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."user" DROP COLUMN "lastName"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."user" DROP COLUMN "firstName"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."user" ADD "displayName" text NOT NULL`
        );
    }
}
