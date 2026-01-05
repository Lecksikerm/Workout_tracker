import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutTemplate } from '../../database/entities/workout-template.entity';
import { WorkoutTemplateExercise } from '../../database/entities/workout-template-exercise.entity';
import { WorkoutTemplatesController } from './workout-templates.controller';
import { WorkoutTemplatesService } from './workout-templates.service';
import { Exercise } from 'src/database/entities/exercise.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WorkoutTemplate, WorkoutTemplateExercise, Exercise])],
    providers: [WorkoutTemplatesService],
    controllers: [WorkoutTemplatesController],
})
export class WorkoutTemplatesModule { }