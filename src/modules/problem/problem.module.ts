import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemSchema } from './schema/problem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Problem.name, schema: ProblemSchema },
    ]),
  ],
  providers: [ProblemService],
  controllers: [ProblemController],
  exports:[ProblemService]
})
export class ProblemModule { }
