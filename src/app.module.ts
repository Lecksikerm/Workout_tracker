import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './database/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ExercisesModule } from './modules/exercises/exercise.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { WorkoutTemplatesModule } from './modules/workout-templates/workout-templates.module';
import { UserWorkoutsModule } from './modules/user-workouts/user-workouts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize: false,

          ...(isProd
            ? {
              url: config.get<string>('DATABASE_URL'),
              ssl: { rejectUnauthorized: false },
            }
            : {
              host: config.get<string>('DB_HOST'),
              port: config.get<number>('DB_PORT') || 5432,
              username: config.get<string>('DB_USERNAME'),
              password: config.get<string>('DB_PASSWORD'),
              database: config.get<string>('DB_NAME'),
            }),
        };
      },
    }),

    TypeOrmModule.forFeature([User]),

    AuthModule,
    UsersModule,
    ExercisesModule,
    WorkoutsModule,
    WorkoutTemplatesModule,
    UserWorkoutsModule,
  ],
})
export class AppModule { }



