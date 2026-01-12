import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { UserWorkoutsService } from "../services/user-workouts.service";
import { UserWorkoutStatus } from "src/database/entities/user-workout.entity";

class LogSetDto {
    exerciseId: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

class FinishUserWorkoutDto {
    status: string;
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('User Workouts')
@Controller('user-workouts')
export class UserWorkoutsController {
    constructor(private readonly service: UserWorkoutsService) { }

    @Post('/start')
    start(@Req() req, @Body() dto: { workoutId: string }) {
        return this.service.startWorkout(req.user.id, dto.workoutId);
    }

    @Patch('/:id/log-set')
    logSet(@Req() req, @Param('id') id: string, @Body() dto: LogSetDto) {
        return this.service.logSet(req.user.id, id, dto);
    }

    @Patch('/:id/finish')
    finish(@Req() req, @Param('id') id: string, @Body() dto: FinishUserWorkoutDto) {
        
        if (!Object.values(UserWorkoutStatus).includes(dto.status as UserWorkoutStatus)) {
            throw new BadRequestException(`Invalid status. Must be one of: ${Object.values(UserWorkoutStatus).join(', ')}`);
        }

        const status = dto.status as UserWorkoutStatus;
        return this.service.finishWorkout(req.user.id, id, status);
    }

    @Get('/:id')
    getOne(@Req() req, @Param('id') id: string) {
        return this.service.getOne(req.user.id, id);
    }
}


