import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Workout } from './workout.entity';
import { Exercise } from './exercise.entity';

@Entity('workout_exercises')
export class WorkoutExercise extends Base {
    @ManyToOne(() => Workout, workout => workout.exercises, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workout_id' })  
    workout: Workout;

    @ManyToOne(() => Exercise, { eager: true })
    @JoinColumn({ name: 'exercise_id' })  
    exercise: Exercise;

    @Column({ type: 'int' })
    sets: number;

    @Column({ type: 'int' })
    reps: number;

    @Column({ type: 'float', nullable: true })
    weight: number;
}


