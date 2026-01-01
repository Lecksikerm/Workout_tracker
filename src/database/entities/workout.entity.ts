import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity('workouts')
export class Workout extends Base {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @Column({ name: 'scheduled_at', type: 'timestamptz' })
    scheduledAt: Date;

    @ManyToOne(() => User, user => user.workouts, { nullable: false })
    @JoinColumn({ name: 'user_id' }) 
    user: User;

    @OneToMany(() => WorkoutExercise, we => we.workout, { cascade: true })
    exercises: WorkoutExercise[];

}
