import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyConcept, DraftConcept, DraftExercise, Exercise } from './content.schemas';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(DailyConcept.name) private conceptModel: Model<DailyConcept>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(DraftConcept.name) private draftConceptModel: Model<DraftConcept>,
    @InjectModel(DraftExercise.name) private draftExerciseModel: Model<DraftExercise>
  ) {}

  today(lang = 'fr') {
    const dateKey = new Date().toISOString().slice(0, 10);
    return this.conceptModel.findOne({ dateKey, lang }).lean();
  }

  async session(lang = 'fr') {
    const concept = await this.today(lang);
    if (!concept) throw new NotFoundException('No concept for today');
    const exercises = await this.exerciseModel.find({ conceptId: concept._id, lang }).limit(3).lean();
    return { concept, exercises };
  }

  reviewDue(userId: string) {
    return { userId, dueItems: [] as unknown[] };
  }

  async publishDraft(id: string) {
    const draft = await this.draftConceptModel.findById(id);
    if (!draft) throw new NotFoundException('Draft not found');
    draft.status = 'published';
    await draft.save();
    return this.conceptModel.create({
      dateKey: draft.dateKey,
      title: draft.title,
      story: draft.story,
      content: draft.content,
      imageUrl: draft.imageUrl,
      audioUrl: draft.audioUrl,
      tags: draft.tags,
      gradeBands: draft.gradeBands,
      lang: draft.lang
    });
  }

  saveDraftConcept(payload: Record<string, unknown>) {
    return this.draftConceptModel.create(payload);
  }
  saveDraftExercises(payload: Record<string, unknown>[]) {
    return this.draftExerciseModel.insertMany(payload);
  }
}
