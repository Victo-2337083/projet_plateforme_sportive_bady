import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { DailyConcept, DailyConceptSchema, DraftConcept, DraftConceptSchema, DraftExercise, DraftExerciseSchema, Exercise, ExerciseSchema } from './content.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyConcept.name, schema: DailyConceptSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: DraftConcept.name, schema: DraftConceptSchema },
      { name: DraftExercise.name, schema: DraftExerciseSchema }
    ])
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService, MongooseModule]
})
export class ContentModule {}
