import {
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { UserWorkoutExercise } from './user-workout-exercise.entity';

@Entity('user_workout_sets')
export class UserWorkoutSet extends Base {
    @ManyToOne(
        () => UserWorkoutExercise,
        (exercise) => exercise.sets,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'user_workout_exercise_id' }) 
    userWorkoutExercise: UserWorkoutExercise;

    @Column({ type: 'int', nullable: true })
    reps: number;

    @Column({ type: 'float', nullable: true })
    weight: number;

    @Column({ type: 'int', nullable: true })
    duration: number;

    @Column({ default: true })
    completed: boolean;
}
