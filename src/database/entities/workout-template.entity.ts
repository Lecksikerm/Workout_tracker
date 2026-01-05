import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { WorkoutTemplateExercise } from './workout-template-exercise.entity';

@Entity('workout_templates')
export class WorkoutTemplate extends Base {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => User, (user) => user.workoutTemplates, {
        onDelete: 'CASCADE',
    })
      @JoinColumn({ name: 'user_id' }) 
    user: User;

    @OneToMany(
        () => WorkoutTemplateExercise,
        (exercise) => exercise.workoutTemplate,
        { cascade: true },
    )
    exercises: WorkoutTemplateExercise[];
}

