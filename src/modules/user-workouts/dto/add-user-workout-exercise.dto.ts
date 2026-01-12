import { IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserWorkoutExerciseDto {
    @ApiProperty()
    @IsUUID()
    exerciseId: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    order: number;
}
