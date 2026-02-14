import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
class DueItem {
  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true }) exerciseId!: Types.ObjectId;
  @Prop({ required: true }) nextDueDate!: Date;
  @Prop({ required: true, default: 1 }) intervalDays!: number;
  @Prop({ required: true, default: 0 }) successStreak!: number;
}

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true }) userId!: Types.ObjectId;
  @Prop({ type: [DueItem], default: [] }) dueItems!: DueItem[];
  @Prop({ type: Object, default: {} }) mastery!: Record<string, number>;
  @Prop({ default: 0 }) streak!: number;
  @Prop({ default: 0 }) totalMinutes!: number;
}

export type ProgressDocument = HydratedDocument<Progress>;
export const ProgressSchema = SchemaFactory.createForClass(Progress);
