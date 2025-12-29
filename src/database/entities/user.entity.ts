import { Entity, Column, Unique } from 'typeorm';
import { Base } from './base.entity';

@Entity('users')
@Unique(['email'])
export class User extends Base {
    @Column({ name: 'full_name', type: 'varchar', length: 100 })
    fullName: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar' })
    password: string;
}

