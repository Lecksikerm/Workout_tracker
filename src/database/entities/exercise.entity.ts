import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';


@Entity({ name: 'exercises' })
export class Exercise extends Base {
    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column()
    category: string;

    @Column({ name: 'muscle_group' })
    muscleGroup: string;
}
