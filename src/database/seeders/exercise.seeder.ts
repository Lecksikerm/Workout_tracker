import { DataSource } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';


export async function seedExercises(dataSource: DataSource) {
    const repo = dataSource.getRepository(Exercise);

    const exercises = [
        {
            name: 'Push Ups',
            description: 'Upper body strength exercise',
            category: 'strength',
            muscleGroup: 'chest',
        },
        {
            name: 'Squats',
            description: 'Lower body compound movement',
            category: 'strength',
            muscleGroup: 'legs',
        },
        {
            name: 'Plank',
            description: 'Core stability exercise',
            category: 'strength',
            muscleGroup: 'core',
        },
    ];

    for (const exercise of exercises) {
        const exists = await repo.findOne({ where: { name: exercise.name } });
        if (!exists) {
            await repo.save(repo.create(exercise));
        }
    }
}
