import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkoutTemplates1700000000000
  implements MigrationInterface
{
  name = 'CreateWorkoutTemplates1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.query(`
      CREATE TABLE workout_templates (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        description TEXT,
        user_id uuid NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      ALTER TABLE workout_templates
      ADD CONSTRAINT fk_workout_templates_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_workout_templates_user_id
      ON workout_templates(user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE workout_template_exercises (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        workout_template_id uuid NOT NULL,
        exercise_id uuid NOT NULL,
        sets INT NOT NULL,
        reps INT NOT NULL,
        "order" INT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      ALTER TABLE workout_template_exercises
      ADD CONSTRAINT fk_template_exercises_template
      FOREIGN KEY (workout_template_id)
      REFERENCES workout_templates(id)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE workout_template_exercises
      ADD CONSTRAINT fk_template_exercises_exercise
      FOREIGN KEY (exercise_id)
      REFERENCES exercises(id)
      ON DELETE RESTRICT;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_template_exercises_template_id
      ON workout_template_exercises(workout_template_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS workout_template_exercises;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS workout_templates;
    `);
  }
}
