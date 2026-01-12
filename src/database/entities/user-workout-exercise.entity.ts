import {
    Entity,
    ManyToOne,
    OneToMany,
    Column,
    JoinColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Exercise } from './exercise.entity';
import { UserWorkout } from './user-workout.entity';
import { UserWorkoutSet } from './user-workout-set.entity';

@Entity('user_workout_exercises')
export class UserWorkoutExercise extends Base {
    @ManyToOne(() => UserWorkout, (uw) => uw.exercises, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userWorkoutId' }) 
    userWorkout: UserWorkout;

    @ManyToOne(() => Exercise, { eager: true })
    @JoinColumn({ name: 'exercise_id' })  
    exercise: Exercise;

    @Column()
    order: number;

    @OneToMany(() => UserWorkoutSet, (set) => set.userWorkoutExercise, {
        cascade: true,
    })
    sets: UserWorkoutSet[];
}

