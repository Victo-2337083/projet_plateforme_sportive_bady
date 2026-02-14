import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DailyConcept {
  @Prop({ required: true, unique: true }) dateKey!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) story!: string;
  @Prop({ required: true }) content!: string;
  @Prop() imageUrl?: string;
  @Prop() audioUrl?: string;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: [String], default: [] }) gradeBands!: string[];
  @Prop({ default: 'fr' }) lang!: string;
}

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ type: Types.ObjectId, ref: 'DailyConcept', required: true }) conceptId!: Types.ObjectId;
  @Prop({ required: true, enum: ['qcm', 'association', 'memory', 'dragdrop'] }) type!: string;
  @Prop({ required: true }) prompt!: string;
  @Prop({ type: [String], default: [] }) options!: string[];
  @Prop({ type: Object, required: true }) answer!: Record<string, unknown>;
  @Prop({ required: true }) explanation!: string;
  @Prop({ default: 1 }) difficulty!: number;
  @Prop() gradeBand?: string;
  @Prop({ default: 'fr' }) lang!: string;
}

@Schema({ timestamps: true })
export class DraftConcept extends DailyConcept {
  @Prop({ required: true, enum: ['draft', 'rejected', 'published'], default: 'draft' }) status!: string;
  @Prop({ type: Object }) moderationResult?: Record<string, unknown>;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) createdBy!: Types.ObjectId;
}

@Schema({ timestamps: true })
export class DraftExercise extends Exercise {
  @Prop({ required: true, enum: ['draft', 'rejected', 'published'], default: 'draft' }) status!: string;
  @Prop({ type: Object }) moderationResult?: Record<string, unknown>;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) createdBy!: Types.ObjectId;
}

export type DailyConceptDocument = HydratedDocument<DailyConcept>;
export type ExerciseDocument = HydratedDocument<Exercise>;
export type DraftConceptDocument = HydratedDocument<DraftConcept>;
export type DraftExerciseDocument = HydratedDocument<DraftExercise>;

export const DailyConceptSchema = SchemaFactory.createForClass(DailyConcept);
export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
export const DraftConceptSchema = SchemaFactory.createForClass(DraftConcept);
export const DraftExerciseSchema = SchemaFactory.createForClass(DraftExercise);
