import { Module } from '@nestjs/common';
import { ExecutionModule } from '../execution/execution.module';
import { ProblemModule } from '../problem/problem.module';
import { RunController } from './run.controller';

@Module({
  imports:[ExecutionModule,ProblemModule],
  controllers:[RunController]
})
export class RunModule {}
