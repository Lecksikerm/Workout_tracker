import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserWorkout, UserWorkoutStatus } from "src/database/entities/user-workout.entity";
import { Workout } from "src/database/entities/workout.entity";
import { UserWorkoutExercise } from "src/database/entities/user-workout-exercise.entity";
import { UserWorkoutSet } from "src/database/entities/user-workout-set.entity";

@Injectable()
export class UserWorkoutsService {
    constructor(
        @InjectRepository(UserWorkout)
        private readonly userWorkoutRepo: Repository<UserWorkout>,

        @InjectRepository(Workout)
        private readonly workoutRepo: Repository<Workout>,

        @InjectRepository(UserWorkoutExercise)
        private readonly userWorkoutExerciseRepo: Repository<UserWorkoutExercise>,

        @InjectRepository(UserWorkoutSet)
        private readonly userWorkoutSetRepo: Repository<UserWorkoutSet>,
    ) { }

    async startWorkout(userId: string, workoutId: string) {
       
        const workout = await this.workoutRepo.findOne({ where: { id: workoutId } });
        if (!workout) throw new NotFoundException('Workout not found');

        const active = await this.userWorkoutRepo.findOne({
            where: {
                user: { id: userId },
                status: UserWorkoutStatus.IN_PROGRESS,
            },
        });

        if (active) {
            throw new ForbiddenException('You already have an active workout. Finish it first.');
        }

        const entity = this.userWorkoutRepo.create({
            user: { id: userId } as any,
            workout: { id: workoutId } as any,
            status: UserWorkoutStatus.IN_PROGRESS,
        });

        return this.userWorkoutRepo.save(entity);
    }

    async logSet(
        userId: string,
        workoutId: string,
        dto: { exerciseId: string; reps?: number; weight?: number; duration?: number },
    ) {
        const workout = await this.userWorkoutRepo.findOne({
            where: { id: workoutId },
            relations: ['user'],
        });

        if (!workout) throw new NotFoundException('Workout not found');
        if (workout.user.id !== userId) throw new ForbiddenException();
        if (workout.status !== UserWorkoutStatus.IN_PROGRESS)
            throw new ForbiddenException('Workout is not active');

        let exerciseRow = await this.userWorkoutExerciseRepo.findOne({
            where: {
                userWorkout: { id: workoutId },
                exercise: { id: dto.exerciseId },
            },
        });

        if (!exerciseRow) {
            exerciseRow = this.userWorkoutExerciseRepo.create({
                userWorkout: { id: workoutId } as any,
                exercise: { id: dto.exerciseId } as any,
                order: 0,
            });
            exerciseRow = await this.userWorkoutExerciseRepo.save(exerciseRow);
        }

        const set = this.userWorkoutSetRepo.create({
            userWorkoutExercise: { id: exerciseRow.id } as any,
            reps: dto.reps,
            weight: dto.weight,
            duration: dto.duration,
        });

        return this.userWorkoutSetRepo.save(set);
    }

    async finishWorkout(userId: string, id: string, status: UserWorkoutStatus) {
        const workout = await this.userWorkoutRepo.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!workout) throw new NotFoundException('User workout not found');
        if (workout.user.id !== userId) throw new ForbiddenException('Access denied');

        if (workout.status === UserWorkoutStatus.COMPLETED)
            throw new ForbiddenException('Workout already completed');

        workout.status = status;
        workout.completedAt =
            status === UserWorkoutStatus.COMPLETED ? new Date() : null;

        return this.userWorkoutRepo.save(workout);
    }

    async getOne(userId: string, id: string) {
        const workout = await this.userWorkoutRepo.findOne({
            where: { id },
            relations: ['user', 'exercises', 'exercises.sets', 'exercises.exercise'],
        });

        if (!workout) throw new NotFoundException();
        if (workout.user.id !== userId) throw new ForbiddenException();

        return workout;
    }
}

