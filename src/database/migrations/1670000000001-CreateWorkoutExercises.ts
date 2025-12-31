import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkoutExercises1670000000001 implements MigrationInterface {
    name = 'CreateWorkoutExercises1670000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "workout_exercises" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "sets" integer NOT NULL,
                "reps" integer NOT NULL,
                "weight" float,
                "workout_id" uuid,
                "exercise_id" uuid,
                "created_at" timestamptz NOT NULL DEFAULT now(),
                "updated_at" timestamptz NOT NULL DEFAULT now(),
                CONSTRAINT "FK_workout" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_exercise" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "workout_exercises" CASCADE;`);
    }
}
