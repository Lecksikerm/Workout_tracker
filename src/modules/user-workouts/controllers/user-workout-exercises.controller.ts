import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AddUserWorkoutExerciseDto } from "../dto/add-user-workout-exercise.dto";
import { UserWorkoutExercisesService } from "../services/user-workout-exercises.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('User Workout Exercises')
@Controller('user-workout-exercises')
export class UserWorkoutExercisesController {
    constructor(private readonly service: UserWorkoutExercisesService) { }

    @Post('/:userWorkoutId')
    addExercise(
        @Req() req,
        @Param('userWorkoutId') userWorkoutId: string,
        @Body() dto: AddUserWorkoutExerciseDto,
    ) {
        return this.service.addExercise(
            req.user.id,
            userWorkoutId,
            dto.exerciseId,
            dto.order,
        );
    }
}
