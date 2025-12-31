import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkoutExerciseDto } from './workout-exercise.dto';

export class CreateWorkoutDto {
    @ApiProperty({ example: 'Chest Day' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Upper body strength workout', required: false })
    @IsString()
    notes?: string;

    @ApiProperty({ example: '2025-12-31T10:00:00.000Z' })
    @IsDateString()
    scheduledAt: string;

    @ApiProperty({ type: [WorkoutExerciseDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkoutExerciseDto)
    exercises: WorkoutExerciseDto[];
}



