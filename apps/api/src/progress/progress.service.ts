import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { nextIntervalDays } from '@daily/shared';
import { Progress } from './progress.schema';

@Injectable()
export class ProgressService {
  constructor(@InjectModel(Progress.name) private progressModel: Model<Progress>) {}

  async updateExerciseResult(userId: string, exerciseId: string, wasCorrect: boolean) {
    const progress =
      (await this.progressModel.findOne({ userId: new Types.ObjectId(userId) })) ||
      (await this.progressModel.create({ userId: new Types.ObjectId(userId), dueItems: [] }));
    const existing = progress.dueItems.find((item) => item.exerciseId.toString() === exerciseId);
    const successStreak = wasCorrect ? (existing?.successStreak ?? 0) + 1 : 0;
    const intervalDays = nextIntervalDays(successStreak - 1, wasCorrect);
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + intervalDays);

    if (existing) {
      existing.successStreak = successStreak;
      existing.intervalDays = intervalDays;
      existing.nextDueDate = nextDueDate;
    } else {
      progress.dueItems.push({ exerciseId: new Types.ObjectId(exerciseId), successStreak, intervalDays, nextDueDate });
    }
    await progress.save();
    return progress;
  }
}
