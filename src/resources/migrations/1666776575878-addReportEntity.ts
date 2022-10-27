import { MigrationInterface, QueryRunner } from "typeorm";

export class addReportEntity1666776575878 implements MigrationInterface {
    name = "addReportEntity1666776575878";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."report_reason_enum" AS ENUM('NSFW_CONTENT', 'VIOLENCE_BULLING', 'DANGEROUS_ACT', 'SPAM', 'CHILD_ABUSE', 'OTHER')`
        );
        await queryRunner.query(
            `CREATE TABLE "report" ("userId" uuid NOT NULL, "videoId" uuid NOT NULL, "reason" "public"."report_reason_enum" NOT NULL, "details" text NOT NULL, "state" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_22f31fb84e35d8009b3ef3e2ea5" PRIMARY KEY ("userId", "videoId"))`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_22f31fb84e35d8009b3ef3e2ea" ON "report" ("userId", "videoId") `
        );
        await queryRunner.query(
            `ALTER TABLE "report" ADD CONSTRAINT "FK_c05518f5a7e674e24145f7f06d8" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_22f31fb84e35d8009b3ef3e2ea"`
        );
        await queryRunner.query(
            `ALTER TABLE "report" DROP CONSTRAINT "FK_c05518f5a7e674e24145f7f06d8"`
        );
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TYPE "public"."report_reason_enum"`);
    }
}
