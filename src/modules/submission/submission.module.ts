import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { Submission, SubmissionSchema } from './schema/submission.schema';
import { ProblemModule } from '../problem/problem.module';
import { ExecutionModule } from '../execution/execution.module';
import { JudgeModule } from '../judge/judge.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    ProblemModule,
    ExecutionModule,
    JudgeModule,
  ],
  providers: [SubmissionService],
  controllers: [SubmissionController],
})
export class SubmissionModule {}
