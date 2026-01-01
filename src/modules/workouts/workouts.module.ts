import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { Workout } from 'src/database/entities/workout.entity';
import { WorkoutExercise } from 'src/database/entities/workout-exercise.entity';
import { Exercise } from 'src/database/entities/exercise.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Workout,
            WorkoutExercise,
            Exercise,
        ]),
    ],
    controllers: [WorkoutsController],
    providers: [WorkoutsService],
})
export class WorkoutsModule { }
