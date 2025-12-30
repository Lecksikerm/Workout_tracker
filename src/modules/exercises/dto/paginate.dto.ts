import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDto {
    @ApiPropertyOptional({ description: 'Page number', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page?: number;

    @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    limit?: number;

    @ApiPropertyOptional({ description: 'Exercise category', example: 'strength' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Muscle group', example: 'chest' })
    @IsOptional()
    @IsString()
    muscleGroup?: string;
}