import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { User } from './entities/user.entity';
import { Exercise } from './entities/exercise.entity';
import { Workout } from './entities/workout.entity';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { WorkoutTemplate } from './entities/workout-template.entity';
import { WorkoutTemplateExercise } from './entities/workout-template-exercise.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    User,
    Exercise,
    Workout,
    WorkoutExercise,
    WorkoutTemplate,
    WorkoutTemplateExercise,
  ],

  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
  logging: true,
});


