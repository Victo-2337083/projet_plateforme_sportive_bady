import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AdminAiController } from './admin-ai.controller';
import { AdminAiService } from './admin-ai.service';
import { OpenAiService } from '../openai/openai.service';
import { RolesGuard } from '../auth/roles.guard';
import { ContentModule } from '../content/content.module';
import { DraftConcept, DraftConceptSchema, DraftExercise, DraftExerciseSchema } from '../content/content.schemas';

@Module({
  imports: [
    ConfigModule,
    ContentModule,
    MongooseModule.forFeature([
      { name: DraftConcept.name, schema: DraftConceptSchema },
      { name: DraftExercise.name, schema: DraftExerciseSchema }
    ])
  ],
  controllers: [AdminAiController],
  providers: [AdminAiService, OpenAiService, { provide: APP_GUARD, useClass: RolesGuard }]
})
export class AdminAiModule {}
