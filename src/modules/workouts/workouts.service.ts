import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Workout } from 'src/database/entities/workout.entity';
import { WorkoutExercise } from 'src/database/entities/workout-exercise.entity';
import { Exercise } from 'src/database/entities/exercise.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PaginationDto } from './dto/paginationdto';

@Injectable()
export class WorkoutsService {
    constructor(
        private readonly dataSource: DataSource,

        @InjectRepository(Workout)
        private readonly workoutRepo: Repository<Workout>,

        @InjectRepository(WorkoutExercise)
        private readonly workoutExerciseRepo: Repository<WorkoutExercise>,

        @InjectRepository(Exercise)
        private readonly exerciseRepo: Repository<Exercise>,
    ) { }

    async create(userId: string, dto: CreateWorkoutDto): Promise<Workout> {
        return this.dataSource.transaction(async manager => {
            const workoutRepo = manager.getRepository(Workout);
            const exerciseRepo = manager.getRepository(Exercise);
            const workoutExerciseRepo = manager.getRepository(WorkoutExercise);

            const workout = workoutRepo.create({
                name: dto.name,
                notes: dto.notes,
                scheduledAt: new Date(dto.scheduledAt),
                user: { id: userId },
            });

            await workoutRepo.save(workout);

            const workoutExercises: WorkoutExercise[] = [];

            for (const item of dto.exercises) {
                const exercise = await exerciseRepo.findOneBy({
                    id: item.exerciseId,
                });

                if (!exercise) {
                    throw new NotFoundException('Exercise not found');
                }

                workoutExercises.push(
                    workoutExerciseRepo.create({
                        workout,
                        exercise,
                        sets: item.sets,
                        reps: item.reps,
                        weight: item.weight,
                    }),
                );
            }

            await workoutExerciseRepo.save(workoutExercises);

            return workout;
        });
    }

    async findAll(userId: string, paginationDto: PaginationDto): Promise<Workout[]> {
        const { page = 1, limit = 10 } = paginationDto;

        return this.workoutRepo.find({
            where: { user: { id: userId } },
            order: { scheduledAt: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['user', 'exercises', 'exercises.exercise'],
        });
    }

    async findOne(userId: string, id: string): Promise<Workout> {
        const workout = await this.workoutRepo.findOne({
            where: { id },
            relations: ['user', 'exercises', 'exercises.exercise'],
        });

        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        if (workout.user.id !== userId) {
            throw new ForbiddenException();
        }

        return workout;
    }

    async update(
        userId: string,
        id: string,
        dto: UpdateWorkoutDto,
    ): Promise<Workout> {
        const workout = await this.findOne(userId, id);

        Object.assign(workout, {
            ...dto,
            scheduledAt: dto.scheduledAt
                ? new Date(dto.scheduledAt)
                : workout.scheduledAt,
        });

        return this.workoutRepo.save(workout);
    }

    async remove(userId: string, id: string): Promise<void> {
        const result = await this.workoutRepo.delete({
            id,
            user: { id: userId },
        });

        if (result.affected === 0) {
            throw new NotFoundException('Workout not found');
        }
    }
}
