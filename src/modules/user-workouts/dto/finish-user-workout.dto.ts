import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserWorkoutStatus } from 'src/database/entities/user-workout.entity';


export class FinishUserWorkoutDto {
    @ApiProperty({ enum: UserWorkoutStatus })
    @IsEnum(UserWorkoutStatus)
    status: UserWorkoutStatus;
}
