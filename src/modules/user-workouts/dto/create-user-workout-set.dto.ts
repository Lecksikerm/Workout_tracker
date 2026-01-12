import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserWorkoutSetDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    reps?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    duration?: number;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
