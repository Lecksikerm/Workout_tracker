import {
    Entity,
    ManyToOne,
    OneToMany,
    Column,
    JoinColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Workout } from './workout.entity';
import { UserWorkoutExercise } from './user-workout-exercise.entity';

export enum UserWorkoutStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

@Entity('user_workouts')
export class UserWorkout extends Base {
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workout_id' })
    workout: Workout;

    @Column({
        type: 'enum',
        enum: UserWorkoutStatus,
        default: UserWorkoutStatus.IN_PROGRESS,
    })
    status: UserWorkoutStatus;

    @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
    completedAt: Date | null;

    @OneToMany(
        () => UserWorkoutExercise,
        (exercise) => exercise.userWorkout,
        { cascade: true },
    )
    exercises: UserWorkoutExercise[];
}

