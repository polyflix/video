import { MigrationInterface, QueryRunner } from "typeorm";

export class addWatchtime1651770496578 implements MigrationInterface {
    name = "addWatchtime1651770496578";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "watchtime"
                                 (
                                     "userId"         character varying(64) NOT NULL,
                                     "videoId"        character varying(64) NOT NULL,
                                     "watchedSeconds" double precision      NOT NULL,
                                     "watchedPercent" double precision      NOT NULL,
                                     "isWatched"      boolean               NOT NULL DEFAULT false,
                                     CONSTRAINT "PK_31a28a551253867030c3a15a262" PRIMARY KEY ("userId", "videoId")
                                 )`);
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_31a28a551253867030c3a15a26" ON "watchtime" ("userId", "videoId") `
        );
        await queryRunner.query(`ALTER TABLE "watchtime"
            ADD CONSTRAINT "FK_6b158a1ab958d80004650f327bb" FOREIGN KEY ("videoId") REFERENCES "video" ("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "watchtime" DROP CONSTRAINT "FK_6b158a1ab958d80004650f327bb"`
        );
        await queryRunner.query(
            `DROP INDEX "video"."IDX_31a28a551253867030c3a15a26"`
        );
        await queryRunner.query(`DROP TABLE "watchtime"`);
    }
}
