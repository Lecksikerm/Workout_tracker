import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserWorkoutSetDto } from "../dto/create-user-workout-set.dto";
import { UserWorkoutSetsService } from "../services/user-workout-sets.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('User Workout Sets')
@Controller('user-workout-sets')
export class UserWorkoutSetsController {
    constructor(private readonly service: UserWorkoutSetsService) { }

    @Post('/:userWorkoutExerciseId')
    create(
        @Req() req,
        @Param('userWorkoutExerciseId') id: string,
        @Body() dto: CreateUserWorkoutSetDto,
    ) {
        return this.service.createSet(req.user.id, id, dto);
    }
}
