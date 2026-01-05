import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutTemplatesService } from './workout-templates.service';
import { CreateWorkoutTemplateDto } from './dto/create-workout-template.dto';
import { UpdateWorkoutTemplateDto } from './dto/update-workout-template.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Workout Templates')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('workout-templates')
export class WorkoutTemplatesController {
    constructor(
        private readonly service: WorkoutTemplatesService,
    ) { }

    @Post('/')
    create(@Req() req, @Body() dto: CreateWorkoutTemplateDto) {
        return this.service.create(req.user, dto);
    }

    @Get('/all')
    findAll(
        @Req() req,
        @Query() pagination: PaginationDto,
    ) {
        return this.service.findAll(req.user, pagination);
    }

    @Get('/:id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.service.findOne(id, req.user);
    }

    @Patch('/:id')
    update(
        @Param('id') id: string,
        @Req() req,
        @Body() dto: UpdateWorkoutTemplateDto,
    ) {
        return this.service.update(id, req.user, dto);
    }

    @Delete('/:id')
    remove(@Param('id') id: string, @Req() req) {
        return this.service.remove(id, req.user);
    }
}
