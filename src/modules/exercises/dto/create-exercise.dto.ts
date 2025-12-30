import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
    @ApiProperty({ example: 'Push Up' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'A bodyweight exercise for upper body strength',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'strength' })
    @IsString()
    category: string;

    @ApiProperty({ example: 'chest' })
    @IsString()
    muscleGroup: string;
}
