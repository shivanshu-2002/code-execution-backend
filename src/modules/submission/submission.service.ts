import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schema/submission.schema';
import { ProblemService } from '../problem/problem.service';
import { ExecutionService } from '../execution/execution.service';
import { JudgeService } from '../judge/judge.service';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private problemService: ProblemService,
    private executionService: ExecutionService,
    private judgeService: JudgeService,
  ) {}

  async submit(
    userId: string,
    problemId: string,
    language: string,
    code: string,
  ) {

    console.log("Creating submission ...")
    const submission = await this.submissionModel.create({
      userId,
      problemId,
      language,
      code,
    });


    console.log("Fetching problem");
    const problem = await this.problemService.findWithTestCases(problemId);

    if(!problem){
       throw new NotFoundException("Problem Not found");
    }
    console.log("Sending the code for execution")
    const executionResult = await this.executionService.run(
      language,
      code,
      problem.functionName,
      problem.hiddenTestCases, 
    );

    console.log("Comparing results");
    const verdict = this.judgeService.judge(
      executionResult,
      problem.hiddenTestCases,
    );

    submission.status = verdict.status as any; 
    submission.executionTime = verdict.executionTime;
    submission.errorMessage = verdict.errorMessage;

    await submission.save();

    return submission;
  }
  
}
