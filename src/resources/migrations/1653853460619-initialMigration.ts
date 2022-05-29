import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1653853460619 implements MigrationInterface {
    name = "initialMigration1653853460619";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."video_visibility_enum" AS ENUM('public', 'protected', 'private')`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."video_sourcetype_enum" AS ENUM('youtube', 'internal', 'unknown')`
        );
        await queryRunner.query(
            `CREATE TABLE "public"."video" ("slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "title" text NOT NULL, "description" text NOT NULL, "thumbnail" text NOT NULL, "likes" integer NOT NULL DEFAULT '0', "views" integer NOT NULL DEFAULT '0', "publisherId" uuid NOT NULL, "visibility" "public"."video_visibility_enum" NOT NULL DEFAULT 'public', "draft" boolean NOT NULL DEFAULT false, "sourceType" "public"."video_sourcetype_enum" NOT NULL, "source" character varying NOT NULL, CONSTRAINT "PK_11c248abdf3cf9cdafabccab429" PRIMARY KEY ("slug"))`
        );
        await queryRunner.query(
            `CREATE TABLE "public"."watchtime" ("userId" character varying NOT NULL, "videoSlug" character varying NOT NULL, "watchedSeconds" double precision NOT NULL, "watchedPercent" double precision NOT NULL, "isWatched" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_116827693490019114995254e3c" PRIMARY KEY ("userId", "videoSlug"))`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_116827693490019114995254e3" ON "public"."watchtime" ("userId", "videoSlug") `
        );
        await queryRunner.query(
            `CREATE TABLE "public"."like" ("userId" character varying NOT NULL, "videoId" character varying NOT NULL, CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("userId", "videoId"))`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4b5e4d8b9889ba0889e2e923ea" ON "public"."like" ("userId", "videoId") `
        );
        await queryRunner.query(
            `CREATE TABLE "public"."user" ("userId" character varying NOT NULL, "avatar" text NOT NULL, "displayName" text NOT NULL, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."watchtime" ADD CONSTRAINT "FK_80aaf1b3ad5c80a7d21ae9ae7d2" FOREIGN KEY ("videoSlug") REFERENCES "public"."video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."like" ADD CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41" FOREIGN KEY ("videoId") REFERENCES "public"."video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "public"."like" DROP CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41"`
        );
        await queryRunner.query(
            `ALTER TABLE "public"."watchtime" DROP CONSTRAINT "FK_80aaf1b3ad5c80a7d21ae9ae7d2"`
        );
        await queryRunner.query(`DROP TABLE "public"."user"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_4b5e4d8b9889ba0889e2e923ea"`
        );
        await queryRunner.query(`DROP TABLE "public"."like"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_116827693490019114995254e3"`
        );
        await queryRunner.query(`DROP TABLE "public"."watchtime"`);
        await queryRunner.query(`DROP TABLE "public"."video"`);
        await queryRunner.query(`DROP TYPE "public"."video_sourcetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."video_visibility_enum"`);
    }
}
