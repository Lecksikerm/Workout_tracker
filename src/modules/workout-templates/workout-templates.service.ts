import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { WorkoutTemplate } from '../../database/entities/workout-template.entity';
import { WorkoutTemplateExercise } from '../../database/entities/workout-template-exercise.entity';
import { Exercise } from '../../database/entities/exercise.entity';
import { User } from '../../database/entities/user.entity';
import { CreateWorkoutTemplateDto } from './dto/create-workout-template.dto';
import { UpdateWorkoutTemplateDto } from './dto/update-workout-template.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class WorkoutTemplatesService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(WorkoutTemplate)
        private readonly templateRepo: Repository<WorkoutTemplate>,
        @InjectRepository(WorkoutTemplateExercise)
        private readonly templateExerciseRepo: Repository<WorkoutTemplateExercise>,
        @InjectRepository(Exercise)
        private readonly exerciseRepo: Repository<Exercise>,
    ) { }

    async create(user: User, dto: CreateWorkoutTemplateDto): Promise<WorkoutTemplate> {
        return this.dataSource.transaction(async (manager) => {
            // Create the template
            const template = manager.create(WorkoutTemplate, {
                name: dto.name,
                description: dto.description,
                user,
            });
            await manager.save(WorkoutTemplate, template);

            // Handle exercises if provided
            if (dto.exercises && dto.exercises.length > 0) {
                const exerciseIds = dto.exercises.map((e) => e.exerciseId);
                const exercises = await this.exerciseRepo.findBy({ id: In(exerciseIds) });

                // Validate all exercises exist
                const foundExerciseIds = exercises.map(e => e.id);
                const missingExercises = exerciseIds.filter(id => !foundExerciseIds.includes(id));
                if (missingExercises.length > 0) {
                    throw new NotFoundException(`Exercises with IDs ${missingExercises.join(', ')} not found`);
                }

                // Create template exercises
                const templateExercises = dto.exercises.map(item => {
                    const exercise = exercises.find(e => e.id === item.exerciseId);
                    return manager.create(WorkoutTemplateExercise, {
                        workoutTemplate: template,
                        exercise,
                        sets: item.sets,
                        reps: item.reps,
                        order: item.order,
                    });
                });

                await manager.save(WorkoutTemplateExercise, templateExercises);
            }

            // Return the complete template with relations
            const result = await manager.findOne(WorkoutTemplate, {
                where: { id: template.id },
                relations: ['exercises', 'exercises.exercise'],
            });

            if (!result) {
                throw new NotFoundException('Workout template not found after creation');
            }

            return result;
        });
    }

    async findAll(
        user: User,
        pagination: PaginationDto,
    ): Promise<{
        data: WorkoutTemplate[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const { page = 1, limit = 10 } = pagination;

        const [data, total] = await this.templateRepo.findAndCount({
            where: { user: { id: user.id } },
            relations: ['exercises', 'exercises.exercise'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async findOne(id: string, user: User): Promise<WorkoutTemplate> {
        const template = await this.templateRepo.findOne({
            where: { id, user: { id: user.id } },
            relations: ['exercises', 'exercises.exercise'],
        });

        if (!template) {
            throw new NotFoundException('Workout template not found');
        }

        return template;
    }

    async update(id: string, user: User, dto: UpdateWorkoutTemplateDto): Promise<WorkoutTemplate> {
        return this.dataSource.transaction(async (manager) => {
            // Find the template first
            const template = await manager.findOne(WorkoutTemplate, {
                where: { id, user: { id: user.id } },
            });

            if (!template) {
                throw new NotFoundException('Workout template not found');
            }

            // Update basic fields
            template.name = dto.name ?? template.name;
            template.description = dto.description ?? template.description;
            await manager.save(WorkoutTemplate, template);

            // Handle exercises update if provided
            if (dto.exercises && dto.exercises.length > 0) {
                // Delete existing exercises
                await manager.delete(WorkoutTemplateExercise, {
                    workoutTemplate: { id: template.id }
                });

                // Validate all exercises exist
                const exerciseIds = dto.exercises.map((e) => e.exerciseId);
                const exercises = await this.exerciseRepo.findBy({ id: In(exerciseIds) });
                const foundExerciseIds = exercises.map(e => e.id);
                const missingExercises = exerciseIds.filter(id => !foundExerciseIds.includes(id));

                if (missingExercises.length > 0) {
                    throw new NotFoundException(`Exercises with IDs ${missingExercises.join(', ')} not found`);
                }

                // Create new template exercises
                const templateExercises = dto.exercises.map(item => {
                    const exercise = exercises.find(e => e.id === item.exerciseId);
                    return manager.create(WorkoutTemplateExercise, {
                        workoutTemplate: template,
                        exercise,
                        sets: item.sets,
                        reps: item.reps,
                        order: item.order,
                    });
                });

                await manager.save(WorkoutTemplateExercise, templateExercises);
            }

            // Return updated template with relations
            const result = await manager.findOne(WorkoutTemplate, {
                where: { id: template.id },
                relations: ['exercises', 'exercises.exercise'],
            });

            if (!result) {
                throw new NotFoundException('Workout template not found after update');
            }

            return result;
        });
    }

    async remove(id: string, user: User): Promise<void> {
        const result = await this.templateRepo.delete({
            id,
            user: { id: user.id }
        });

        if (result.affected === 0) {
            throw new NotFoundException('Workout template not found');
        }
    }
}

