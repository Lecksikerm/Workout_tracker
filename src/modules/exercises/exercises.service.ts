import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from 'src/database/entities/exercise.entity';
import { PaginateDto } from './dto/paginate.dto';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
    ) { }

    async create(dto: CreateExerciseDto): Promise<Exercise> {
        const exercise = this.exerciseRepository.create(dto);
        return this.exerciseRepository.save(exercise);
    }

    async findAll(paginateDto: PaginateDto) {
        const page = paginateDto.page || 1;
        const limit = paginateDto.limit || 10;
        const skip = (page - 1) * limit;

        const query = this.exerciseRepository.createQueryBuilder('exercise');

        if (paginateDto.category) {
            query.andWhere('exercise.category = :category', { category: paginateDto.category });
        }

        if (paginateDto.muscleGroup) {
            query.andWhere('exercise.muscleGroup = :muscleGroup', { muscleGroup: paginateDto.muscleGroup });
        }

        query.orderBy('exercise.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async findOne(id: string): Promise<Exercise> {
        const exercise = await this.exerciseRepository.findOne({ where: { id } });
        if (!exercise) {
            throw new NotFoundException('Exercise not found');
        }
        return exercise;
    }

    async update(
        id: string,
        dto: UpdateExerciseDto,
    ): Promise<Exercise> {
        const exercise = await this.findOne(id);
        Object.assign(exercise, dto);
        return this.exerciseRepository.save(exercise);
    }

    async remove(id: string): Promise<void> {
        const exercise = await this.findOne(id);
        await this.exerciseRepository.remove(exercise);
    }
}
