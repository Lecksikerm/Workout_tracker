import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExerciseItemDto {
    @ApiProperty({ description: 'The ID of the exercise' })
    @IsString()
    exerciseId: string; 

    @ApiProperty({ description: 'Number of sets for the exercise', required: false })
    @IsNumber()
    @IsOptional()
    sets?: number; 

    @ApiProperty({ description: 'Order of the exercise in the workout template' })
    @IsNumber()
    order: number; 

    @ApiProperty({ description: 'Number of repetitions for the exercise', required: false })
    @IsNumber()
    @IsOptional()
    reps?: number; 

    @ApiProperty({ description: 'Duration of the exercise in seconds', required: false })
    @IsNumber()
    @IsOptional()
    duration?: number; 

    @ApiProperty({ description: 'Rest time between sets in seconds', required: false })
    @IsNumber()
    @IsOptional()
    restTime?: number; 

    @ApiProperty({ description: 'Additional notes for the exercise', required: false })
    @IsString()
    @IsOptional()
    notes?: string; 
}