import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompletedAtToUserWorkouts1679000000001 implements MigrationInterface {
    name = 'AddCompletedAtToUserWorkouts1679000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_workouts"
            ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP WITH TIME ZONE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_workouts"
            DROP COLUMN IF EXISTS "completedAt"
        `);
    }
}
