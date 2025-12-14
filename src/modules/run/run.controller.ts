import { Controller, Post, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ExecutionService } from '../execution/execution.service';
import { ProblemService } from '../problem/problem.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Logger } from '@nestjs/common';

@Controller('run')
@UseGuards(JwtAuthGuard)
export class RunController {
  logger = new Logger('Run Controller');
  constructor(
    private readonly executionService: ExecutionService,
    private readonly problemService: ProblemService,
  ) { }

  @Post()
  async runCode(
    @Body('problemId') problemId: string,
    @Body('language') language: string,
    @Body('code') code: string,
  ) {
    this.logger.log("Code Submitted Successfully");
    const problem = await this.problemService.findById(problemId);
    if (!problem) {
      throw new NotFoundException("Problem Not found");
    }

    // IMPORTANT: use example test cases only
    this.logger.log("Code Execution Starts");
    const result = await this.executionService.run(
      language,
      code,
      problem.functionName,
      problem.exampleTestCases,
    );

    return {
      results: result.output,
      executionTime: result.executionTime,
      error: result.error,
    };
  }
}
