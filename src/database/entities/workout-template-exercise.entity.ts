import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Exercise } from './exercise.entity';
import { WorkoutTemplate } from './workout-template.entity';

@Entity('workout_template_exercises')
export class WorkoutTemplateExercise extends Base {
    @ManyToOne(
        () => WorkoutTemplate,
        (template) => template.exercises,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'workout_template_id' })
    workoutTemplate: WorkoutTemplate;

    @ManyToOne(() => Exercise, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column('int')
    sets: number;

    @Column('int')
    reps: number;

    @Column('int')
    order: number;
}

