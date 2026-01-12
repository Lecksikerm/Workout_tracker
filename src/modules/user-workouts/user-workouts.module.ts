import { Exercise } from "src/database/entities/exercise.entity";
import { UserWorkoutExercisesController } from "./controllers/user-workout-exercises.controller";
import { UserWorkoutSetsController } from "./controllers/user-workout-sets.controller";
import { UserWorkoutsController } from "./controllers/user-workouts.controller";
import { UserWorkoutExercisesService } from "./services/user-workout-exercises.service";
import { UserWorkoutSetsService } from "./services/user-workout-sets.service";
import { UserWorkoutsService } from "./services/user-workouts.service";
import { Workout } from "src/database/entities/workout.entity";
import { UserWorkoutSet } from "src/database/entities/user-workout-set.entity";
import { UserWorkoutExercise } from "src/database/entities/user-workout-exercise.entity";
import { UserWorkout } from "src/database/entities/user-workout.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserWorkout,
            UserWorkoutExercise,
            UserWorkoutSet,
            Workout,
            Exercise,
        ]),
    ],
    controllers: [
        UserWorkoutsController,
        UserWorkoutExercisesController,
        UserWorkoutSetsController,
    ],
    providers: [
        UserWorkoutsService,
        UserWorkoutExercisesService,
        UserWorkoutSetsService,
    ],
})

export class UserWorkoutsModule { }
