import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Workout } from './workout.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
@Unique(['email'])
export class User extends Base {
    @Column({ name: 'full_name', type: 'varchar', length: 100 })
    fullName: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar' })
    @Exclude()
    password: string;

    @OneToMany(() => Workout, workout => workout.user)
    workouts: Workout[];
}

