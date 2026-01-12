import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RestoreWorkoutTemplatesTables1670000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Recreate workout_templates
        await queryRunner.createTable(
            new Table({
                name: "workout_templates",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "name", type: "character varying", length: "100", isNullable: false },
                    { name: "user_id", type: "uuid", isNullable: true },
                    { name: "created_at", type: "timestamp with time zone", default: "now()" },
                    { name: "updated_at", type: "timestamp with time zone", default: "now()" },
                ],
            }),
            true
        );

        // Recreate workout_template_exercises
        await queryRunner.createTable(
            new Table({
                name: "workout_template_exercises",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "workout_template_id", type: "uuid", isNullable: true },
                    { name: "exercise_id", type: "uuid", isNullable: true },
                    { name: "order", type: "integer", isNullable: true },
                ],
            }),
            true
        );

        // Add foreign keys
        await queryRunner.createForeignKey(
            "workout_templates",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "workout_template_exercises",
            new TableForeignKey({
                columnNames: ["workout_template_id"],
                referencedTableName: "workout_templates",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "workout_template_exercises",
            new TableForeignKey({
                columnNames: ["exercise_id"],
                referencedTableName: "exercises",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("workout_template_exercises");
        await queryRunner.dropTable("workout_templates");
    }
}
