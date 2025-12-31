import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Req,
    UseGuards,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout } from 'src/database/entities/workout.entity';
import { PaginationDto } from './dto/paginationdto';

interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}

@ApiTags('Workouts')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
    constructor(private readonly service: WorkoutsService) { }

    @Post('/')
    @ApiOperation({ summary: 'Create a workout' })
    @ApiCreatedResponse({ type: Workout })
    create(@Req() req: AuthRequest, @Body() dto: CreateWorkoutDto) {
        return this.service.create(req.user.id, dto);
    }

    @Get('/all')
    @ApiOperation({ summary: 'Get all workouts (paginated)' })
    @ApiOkResponse({ type: [Workout] })
    findAll(
        @Req() req: AuthRequest,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.service.findAll(req.user.id, paginationDto);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a workout by ID' })
    @ApiOkResponse({ type: Workout })
    findOne(@Req() req: AuthRequest, @Param('id') id: string) {
        return this.service.findOne(req.user.id, id);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a workout' })
    @ApiOkResponse({ type: Workout })
    update(
        @Req() req: AuthRequest,
        @Param('id') id: string,
        @Body() dto: UpdateWorkoutDto,
    ) {
        return this.service.update(req.user.id, id, dto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a workout' })
    @ApiNoContentResponse()
    async remove(@Req() req: AuthRequest, @Param('id') id: string) {
        await this.service.remove(req.user.id, id);
    }
}

