import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserWorkoutSetDto } from "../dto/create-user-workout-set.dto";
import { UserWorkoutExercise } from "src/database/entities/user-workout-exercise.entity";
import { UserWorkoutSet } from "src/database/entities/user-workout-set.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserWorkoutSetsService {
    constructor(
        @InjectRepository(UserWorkoutSet)
        private readonly repo: Repository<UserWorkoutSet>,

        @InjectRepository(UserWorkoutExercise)
        private readonly exerciseRepo: Repository<UserWorkoutExercise>,
    ) { }

    async createSet(
        userId: string,
        userWorkoutExerciseId: string,
        dto: CreateUserWorkoutSetDto,
    ) {
        const exercise = await this.exerciseRepo.findOne({
            where: { id: userWorkoutExerciseId },
            relations: ['userWorkout', 'userWorkout.user'],
        });

        if (!exercise) throw new NotFoundException();
        if (exercise.userWorkout.user.id !== userId)
            throw new ForbiddenException();

        const set = this.repo.create({
            userWorkoutExercise: { id: userWorkoutExerciseId } as any,
            ...dto,
        });

        return this.repo.save(set);
    }
}
