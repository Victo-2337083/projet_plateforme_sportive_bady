import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { ProgressModule } from './progress/progress.module';
import { AdminAiModule } from './admin-ai/admin-ai.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/daily-learning') })
    }),
    AuthModule,
    UsersModule,
    ContentModule,
    ProgressModule,
    AdminAiModule
  ]
})
export class AppModule {}
