import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class WorkoutExerciseDto {
    @ApiProperty({ example: 'uuid-of-exercise' })
    @IsUUID()
    exerciseId: string;

    @ApiProperty({ example: 3 })
    @IsInt()
    @Min(1)
    sets: number;

    @ApiProperty({ example: 12 })
    @IsInt()
    @Min(1)
    reps: number;

    @ApiProperty({ example: 40, required: false })
    @IsOptional()
    weight?: number;
}

