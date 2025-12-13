import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProblemDocument = Problem & Document;

@Schema({ timestamps: true })
export class Problem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  difficulty: 'easy' | 'medium' | 'hard';

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  functionName: string; // e.g. twoSum

  @Prop({ type: Object, required: true })
  starterCode: { //Only two for now
    javascript?: string;
    python?: string;
  };

  @Prop({ type: [Object], default: [] })
  exampleTestCases: {
    input: any;
    output: any;
  }[];

  @Prop({ type: [Object], select: false })
  hiddenTestCases: {
    input: any;
    output: any;
  }[];
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
