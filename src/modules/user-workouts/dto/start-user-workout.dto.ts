import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartUserWorkoutDto {
    @ApiProperty({ example: 'uuid-of-workout' })
    @IsUUID()
    workoutId: string;
}
