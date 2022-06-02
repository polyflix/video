import { MigrationInterface, QueryRunner } from "typeorm";

export class addUuid1654072527596 implements MigrationInterface {
    name = "addUuid1654072527596";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "FK_80aaf1b3ad5c80a7d21ae9ae7d2"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" DROP CONSTRAINT "PK_11c248abdf3cf9cdafabccab429"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_116827693490019114995254e3"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_116827693490019114995254e3c"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
        );
        await queryRunner.query(`ALTER TABLE "watchtime" ADD "videoId" uuid`);
        await queryRunner.query(
            `UPDATE "watchtime" SET "videoId" = (SELECT "id" FROM "video" WHERE "video"."slug" = "watchtime"."videoSlug")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP COLUMN "videoSlug"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ALTER COLUMN "videoId" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_31a28a551253867030c3a15a262" PRIMARY KEY ("videoId", "userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD CONSTRAINT "UQ_11c248abdf3cf9cdafabccab429" UNIQUE ("slug")`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_4b5e4d8b9889ba0889e2e923ea"`
        );
        await queryRunner.query(
            `UPDATE "like" SET "videoId" = (SELECT "id" FROM "video" WHERE "video"."slug" = "like"."videoId")`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ALTER COLUMN "videoId" TYPE uuid USING "videoId"::uuid`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ALTER COLUMN "videoId" SET NOT NULL`
        );
        // await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userId"`);
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_31a28a551253867030c3a15a26" ON "watchtime" ("userId", "videoId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_11c248abdf3cf9cdafabccab42" ON "video" ("slug") `
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4b5e4d8b9889ba0889e2e923ea" ON "like" ("userId", "videoId") `
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "FK_6b158a1ab958d80004650f327bb" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "FK_user_like" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "FK_user_watchtime" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "FK_6b158a1ab958d80004650f327bb"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_4b5e4d8b9889ba0889e2e923ea"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_11c248abdf3cf9cdafabccab42"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_31a28a551253867030c3a15a26"`
        );
        /* await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "PK_d72ea127f30e21753c9e229891e"`
        ); */
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "userId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead"`
        );
        /* await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_e8fb739f08d47955a39850fac23" PRIMARY KEY ("userId")`
        ); */
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "videoId"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD "videoId" character varying NOT NULL`
        );
        /* await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_e8fb739f08d47955a39850fac23"`
        ); */
        /* await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("videoId", "userId")`
        ); */
        /* await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead"`
        ); */
        /* await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_80c9b117ff5a70ddc277b8bdd41" PRIMARY KEY ("videoId")`
        ); */
        await queryRunner.query(`ALTER TABLE "like" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD "userId" character varying NOT NULL`
        );
        /* await queryRunner.query(
            `ALTER TABLE "like" DROP CONSTRAINT "PK_80c9b117ff5a70ddc277b8bdd41"`
        ); */
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "PK_4b5e4d8b9889ba0889e2e923ead" PRIMARY KEY ("userId", "videoId")`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4b5e4d8b9889ba0889e2e923ea" ON "like" ("userId", "videoId") `
        );
        await queryRunner.query(
            `ALTER TABLE "video" DROP CONSTRAINT "UQ_11c248abdf3cf9cdafabccab429"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" DROP CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD CONSTRAINT "PK_2d81ab5d9605a976732b70e19e5" PRIMARY KEY ("slug", "id")`
        );

        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_31a28a551253867030c3a15a262"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_6b158a1ab958d80004650f327bb" PRIMARY KEY ("videoId")`
        );
        await queryRunner.query(`ALTER TABLE "watchtime" DROP COLUMN "userId"`);
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD "userId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_6b158a1ab958d80004650f327bb"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_31a28a551253867030c3a15a262" PRIMARY KEY ("userId", "videoId")`
        );
        await queryRunner.query(
            `ALTER TABLE "video" DROP CONSTRAINT "PK_2d81ab5d9605a976732b70e19e5"`
        );
        await queryRunner.query(
            `ALTER TABLE "video" ADD CONSTRAINT "PK_11c248abdf3cf9cdafabccab429" PRIMARY KEY ("slug")`
        );
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "id"`);
        await queryRunner.query(
            `ALTER TABLE "like" ADD CONSTRAINT "FK_80c9b117ff5a70ddc277b8bdd41" FOREIGN KEY ("videoId") REFERENCES "video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "PK_31a28a551253867030c3a15a262"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "PK_10d3b98a512f5e633a09d22b14d" PRIMARY KEY ("userId")`
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP COLUMN "videoId"`
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
            `CREATE UNIQUE INDEX "IDX_116827693490019114995254e3" ON "watchtime" ("userId", "videoSlug") `
        );
        await queryRunner.query(
            `ALTER TABLE "watchtime" ADD CONSTRAINT "FK_80aaf1b3ad5c80a7d21ae9ae7d2" FOREIGN KEY ("videoSlug") REFERENCES "video"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }
}
