import { MigrationInterface, QueryRunner } from "typeorm";

export class fixEntities1653763059163 implements MigrationInterface {
    name = "fixEntities1653763059163";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "FK_6b158a1ab958d80004650f327bb"`
        );
        await queryRunner.query(
            `DROP INDEX "video"."IDX_31a28a551253867030c3a15a26"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "__v" integer NOT NULL DEFAULT '1'`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "title" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "publisherId" uuid NOT NULL`
        );
        await queryRunner.query(
            `CREATE TYPE "video"."video_visibility_enum" AS ENUM('public', 'protected', 'private')`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "visibility" "video"."video_visibility_enum" NOT NULL DEFAULT 'public'`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "draft" boolean NOT NULL DEFAULT false`
        );
        await queryRunner.query(
            `CREATE TYPE "video"."video_sourcetype_enum" AS ENUM('youtube', 'internal', 'unknown')`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "sourceType" "video"."video_sourcetype_enum" NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "source" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ALTER COLUMN "likes" SET DEFAULT '0'`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ALTER COLUMN "views" SET DEFAULT '0'`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" RENAME COLUMN "videoId" TO "videoSlug"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" RENAME CONSTRAINT "PK_31a28a551253867030c3a15a262" TO "PK_116827693490019114995254e3c"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_116827693490019114995254e3c"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_80aaf1b3ad5c80a7d21ae9ae7d2" PRIMARY KEY ("videoSlug")`
        );
        await queryRunner.query(`ALTER TABLE "watchtime" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD "userId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_80aaf1b3ad5c80a7d21ae9ae7d2"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_116827693490019114995254e3c" PRIMARY KEY ("videoSlug", "userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_116827693490019114995254e3c"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_10d3b98a512f5e633a09d22b14d" PRIMARY KEY ("userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP COLUMN "videoSlug"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD "videoSlug" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_10d3b98a512f5e633a09d22b14d"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_116827693490019114995254e3c" PRIMARY KEY ("userId", "videoSlug")`
        );
        await queryRunner.query(
            `ALTER TABLE "video" DROP CONSTRAINT "PK_11c248abdf3cf9cdafabccab429"`
        );
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "slug"`);
        await queryRunner.query(
            `ALTER TABLE "video" ADD "slug" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD CONSTRAINT "PK_11c248abdf3cf9cdafabccab429" PRIMARY KEY ("slug")`
        );
        await queryRunner.query(
            `DROP INDEX "video"."IDX_4b5e4d8b9889ba0889e2e923ea"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_80c9b117ff5a70ddc277b8bdd41" PRIMARY KEY ("videoId")`
        );
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD "userId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_80c9b117ff5a70ddc277b8bdd41"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("videoId", "userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_e8fb739f08d47955a39850fac23" PRIMARY KEY ("userId")`
        );
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "videoId"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD "videoId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_e8fb739f08d47955a39850fac23"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("userId", "videoId")`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_31a28a551253867030c3a15a26" ON "watchtime" ("userId", "videoSlug") `
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4b5e4d8b9889ba0889e2e923ea" ON "like" ("userId", "videoId") `
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "FK_80aaf1b3ad5c80a7d21ae9ae7d2" FOREIGN KEY ("videoSlug") REFERENCES "video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41" FOREIGN KEY ("videoId") REFERENCES "video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_116827693490019114995254e3" ON "watchtime" ("userId", "videoSlug") `
        );
        await queryRunner.query(
            `DROP INDEX "video"."IDX_31a28a551253867030c3a15a26"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "FK_80aaf1b3ad5c80a7d21ae9ae7d2"`
        );
        await queryRunner.query(
            `DROP INDEX "video"."IDX_116827693490019114995254e3"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ALTER COLUMN "views" DROP DEFAULT`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ALTER COLUMN "likes" DROP DEFAULT`
        );
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "source"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "sourceType"`);
        await queryRunner.query(`DROP TYPE "video"."video_sourcetype_enum"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "draft"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "visibility"`);
        await queryRunner.query(`DROP TYPE "video"."video_visibility_enum"`);
        await queryRunner.query(
            `ALTER TABLE "video" DROP COLUMN "publisherId"`
        );
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "__v"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "createdAt"`);

        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_e8fb739f08d47955a39850fac23" PRIMARY KEY ("userId")`
        );
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "videoId"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD "videoId" character varying(64) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_e8fb739f08d47955a39850fac23"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("videoId", "userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_80c9b117ff5a70ddc277b8bdd41" PRIMARY KEY ("videoId")`
        );
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD "userId" character varying(64) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_80c9b117ff5a70ddc277b8bdd41"`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("userId", "videoId")`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4b5e4d8b9889ba0889e2e923ea" ON "like" ("userId", "videoId") `
        );
        await queryRunner.query(
            `ALTER TABLE "video" DROP CONSTRAINT "PK_11c248abdf3cf9cdafabccab429"`
        );
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "slug"`);
        await queryRunner.query(
            `ALTER TABLE "video" ADD "slug" character varying(64) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD CONSTRAINT "PK_11c248abdf3cf9cdafabccab429" PRIMARY KEY ("slug")`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41" FOREIGN KEY ("videoId") REFERENCES "video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_116827693490019114995254e3c"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_10d3b98a512f5e633a09d22b14d" PRIMARY KEY ("userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP COLUMN "videoSlug"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD "videoSlug" character varying(64) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_10d3b98a512f5e633a09d22b14d"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_116827693490019114995254e3c" PRIMARY KEY ("videoSlug", "userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_116827693490019114995254e3c"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_80aaf1b3ad5c80a7d21ae9ae7d2" PRIMARY KEY ("videoSlug")`
        );
        await queryRunner.query(`ALTER TABLE "watchtime" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD "userId" character varying(64) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_80aaf1b3ad5c80a7d21ae9ae7d2"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_116827693490019114995254e3c" PRIMARY KEY ("userId", "videoSlug")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" RENAME CONSTRAINT "PK_116827693490019114995254e3c" TO "PK_31a28a551253867030c3a15a262"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" RENAME COLUMN "videoSlug" TO "videoId"`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_31a28a551253867030c3a15a26" ON "watchtime" ("userId", "videoId") `
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "FK_6b158a1ab958d80004650f327bb" FOREIGN KEY ("videoId") REFERENCES "video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_31a28a551253867030c3a15a26" ON "watchtime" ("userId", "videoSlug") `
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_31a28a551253867030c3a15a26" ON "watchtime" ("userId", "videoSlug") `
        );
    }
}
