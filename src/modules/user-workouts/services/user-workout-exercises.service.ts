import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercise } from "src/database/entities/exercise.entity";
import { UserWorkoutExercise } from "src/database/entities/user-workout-exercise.entity";
import { UserWorkout } from "src/database/entities/user-workout.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserWorkoutExercisesService {
    constructor(
        @InjectRepository(UserWorkoutExercise)
        private readonly repo: Repository<UserWorkoutExercise>,

        @InjectRepository(UserWorkout)
        private readonly workoutRepo: Repository<UserWorkout>,

        @InjectRepository(Exercise)
        private readonly exerciseRepo: Repository<Exercise>,
    ) { }

    async addExercise(
        userId: string,
        userWorkoutId: string,
        exerciseId: string,
        order: number,
    ) {
        const workout = await this.workoutRepo.findOne({
            where: { id: userWorkoutId },
            relations: ['user'],
        });

        if (!workout) throw new NotFoundException('Workout not found');
        if (workout.user.id !== userId)
            throw new ForbiddenException('Access denied');

        const exercise = await this.exerciseRepo.findOne({
            where: { id: exerciseId },
        });

        if (!exercise) throw new NotFoundException('Exercise not found');

        const entity = this.repo.create({
            userWorkout: { id: userWorkoutId } as any,
            exercise: { id: exerciseId } as any,
            order,
        });

        return this.repo.save(entity);
    }
}
