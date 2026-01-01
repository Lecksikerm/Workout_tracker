import { MigrationInterface, QueryRunner } from "typeorm";

export class  CreateWorkoutSchema1767043200000 implements MigrationInterface {
    name = 'CreateWorkoutSchema1767043200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS workouts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
                name VARCHAR(255) NOT NULL,
                notes TEXT,
                scheduled_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT fk_workouts_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS workout_exercises (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                workout_id UUID NOT NULL,
                exercise_id UUID NOT NULL,
                sets INT NOT NULL,
                reps INT NOT NULL,
                weight FLOAT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT fk_we_workout
                    FOREIGN KEY (workout_id)
                    REFERENCES workouts(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_we_exercise
                    FOREIGN KEY (exercise_id)
                    REFERENCES exercises(id)
                    ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS workout_exercises CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS workouts CASCADE;`);
    }
}
