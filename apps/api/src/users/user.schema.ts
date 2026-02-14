import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, enum: ['child', 'parent', 'teacher', 'admin'] })
  role!: 'child' | 'parent' | 'teacher' | 'admin';

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop()
  childPseudo?: string;

  @Prop()
  gradeLevel?: string;

  @Prop()
  parentEmail?: string;

  @Prop({ default: false })
  parentConsentVerified!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
