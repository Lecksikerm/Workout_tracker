import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from 'src/database/entities/exercise.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginateDto } from './dto/paginate.dto';

@ApiTags('Exercises')
@Controller('exercises')
@ApiBearerAuth('access-token')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @ApiOperation({ summary: 'Create a new exercise' })
    @ApiResponse({ status: 201, type: Exercise })
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    create(@Body() dto: CreateExerciseDto) {
        return this.exercisesService.create(dto);
    }

    @Get('/')
    @ApiOperation({ summary: 'Get all exercises with optional filters' })
    @ApiResponse({ status: 200, type: [Exercise] })
    findAll(@Query() paginateDto: PaginateDto) {
        return this.exercisesService.findAll(paginateDto);
    }


    @ApiOperation({ summary: 'Get a single exercise by ID' })
    @ApiResponse({ status: 200, type: Exercise })
    @Get('/:id')
    findOne(@Param('id') id: string) {
        return this.exercisesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an exercise' })
    @ApiResponse({ status: 200, type: Exercise })
    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateExerciseDto,
    ) {
        return this.exercisesService.update(id, dto);
    }

    @ApiOperation({ summary: 'Delete an exercise' })
    @ApiResponse({ status: 204 })
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async remove(@Param('id') id: string) {
        await this.exercisesService.remove(id);
    }
}
