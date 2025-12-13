import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  problemId: string;

  @Prop({ required: true })
  language: 'javascript' | 'python';

  @Prop({ required: true })
  code: string;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'WRONG_ANSWER' | 'ERROR' | 'TLE';

  @Prop()
  executionTime: number;

  @Prop()
  errorMessage?: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
