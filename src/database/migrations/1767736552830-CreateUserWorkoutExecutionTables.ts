import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserWorkoutExecutionTables1767736552830
    implements MigrationInterface {
    name = "CreateUserWorkoutExecutionTables1767736552830";

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_workouts_status_enum') THEN
          CREATE TYPE user_workouts_status_enum AS ENUM ('IN_PROGRESS', 'COMPLETED');
        END IF;
      END$$;
    `);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_workouts (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        status user_workouts_status_enum NOT NULL DEFAULT 'IN_PROGRESS',
        completed_at TIMESTAMPTZ,
        user_id uuid NOT NULL,
        workout_id uuid NOT NULL
      )
    `);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_workout_exercises (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        "order" integer NOT NULL,
        user_workout_id uuid NOT NULL,
        exercise_id uuid NOT NULL
      )
    `);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_workout_sets (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        reps integer,
        weight double precision,
        duration integer,
        completed boolean NOT NULL DEFAULT true,
        user_workout_exercise_id uuid NOT NULL
      )
    `);

        await queryRunner.query(`
      ALTER TABLE user_workouts
        ADD CONSTRAINT fk_user_workouts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    `);

        await queryRunner.query(`
      ALTER TABLE user_workouts
        ADD CONSTRAINT fk_user_workouts_workout
        FOREIGN KEY (workout_id) REFERENCES workouts(id)
        ON DELETE CASCADE
    `);

        await queryRunner.query(`
      ALTER TABLE user_workout_exercises
        ADD CONSTRAINT fk_uwe_user_workout
        FOREIGN KEY (user_workout_id) REFERENCES user_workouts(id)
        ON DELETE CASCADE
    `);

        await queryRunner.query(`
      ALTER TABLE user_workout_exercises
        ADD CONSTRAINT fk_uwe_exercise
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    `);

        await queryRunner.query(`
      ALTER TABLE user_workout_sets
        ADD CONSTRAINT fk_uws_exercise
        FOREIGN KEY (user_workout_exercise_id)
        REFERENCES user_workout_exercises(id)
        ON DELETE CASCADE
    `);


        //users
        await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN full_name TYPE varchar(100),
      ALTER COLUMN email TYPE varchar(100),
      ALTER COLUMN password TYPE varchar
    `);

        //exercises
        await queryRunner.query(`
      ALTER TABLE exercises
      ALTER COLUMN name TYPE varchar,
      ALTER COLUMN category TYPE varchar,
      ALTER COLUMN muscle_group TYPE varchar
    `);

        //workout_templates
        await queryRunner.query(`
      ALTER TABLE workout_templates
      ALTER COLUMN name TYPE varchar(100)
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE user_workout_sets DROP CONSTRAINT fk_uws_exercise`);
        await queryRunner.query(`ALTER TABLE user_workout_exercises DROP CONSTRAINT fk_uwe_exercise`);
        await queryRunner.query(`ALTER TABLE user_workout_exercises DROP CONSTRAINT fk_uwe_user_workout`);
        await queryRunner.query(`ALTER TABLE user_workouts DROP CONSTRAINT fk_user_workouts_workout`);
        await queryRunner.query(`ALTER TABLE user_workouts DROP CONSTRAINT fk_user_workouts_user`);

        await queryRunner.query(`DROP TABLE IF EXISTS user_workout_sets`);
        await queryRunner.query(`DROP TABLE IF EXISTS user_workout_exercises`);
        await queryRunner.query(`DROP TABLE IF EXISTS user_workouts`);

       
        await queryRunner.query(`DROP TYPE IF EXISTS user_workouts_status_enum`);
    }
}

