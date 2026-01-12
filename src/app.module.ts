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
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    ExercisesModule,
    WorkoutsModule,
    WorkoutTemplatesModule,
    UserWorkoutsModule
  ],
})
export class AppModule { }


