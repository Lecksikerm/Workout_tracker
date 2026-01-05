import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseItemDto } from 'src/modules/exercises/dto/exercise-item.dto';


export class CreateWorkoutTemplateDto {
    @ApiProperty({ example: 'Full Body Template' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'A template for full-body workouts', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: [ExerciseItemDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExerciseItemDto)
    exercises?: ExerciseItemDto[];
}


