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
    explanation:any;
  }[];

  @Prop({type:[String],default:[],required:true})
  constraints:string[];
  
  @Prop({ required: true })
  followup: string; // Can you come up with an algorithm that is less than O(n2) time complexity?
  

  @Prop({ type: [Object],default: [] })
  hiddenTestCases: {
    input: any;
    output: any;
  }[];
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
