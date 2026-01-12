import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { User } from './entities/user.entity';
import { Exercise } from './entities/exercise.entity';
import { Workout } from './entities/workout.entity';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { WorkoutTemplate } from './entities/workout-template.entity';
import { WorkoutTemplateExercise } from './entities/workout-template-exercise.entity';
import { UserWorkoutExercise } from './entities/user-workout-exercise.entity';
import { UserWorkout } from './entities/user-workout.entity';
import { UserWorkoutSet } from './entities/user-workout-set.entity';

config();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in production');
}

export const AppDataSource = new DataSource({
    type: 'postgres',

    ...(isProduction
        ? {
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        }
        : {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }),

    entities: [
        User,
        Exercise,
        Workout,
        WorkoutExercise,
        WorkoutTemplate,
        WorkoutTemplateExercise,
        UserWorkout,
        UserWorkoutExercise,
        UserWorkoutSet,
    ],

    migrations: ['dist/database/migrations/*.js'],

    synchronize: false,
    logging: !isProduction,
});




