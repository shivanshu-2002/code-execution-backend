import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Problem, ProblemDocument } from './schema/problem.schema';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class ProblemService {
  constructor(
    @InjectModel(Problem.name)
    private problemModel: Model<ProblemDocument>,
  ) {}

  create(data: CreateProblemDto) {
    return this.problemModel.create(data);
  }

  findAll() {
    return this.problemModel.find().select('title tags difficulty');
  }

  findById(id: string) {
    return this.problemModel.findById(id).select('-hiddenTestCases');
  }

  findWithTestCases(id: string) {
    return this.problemModel.findById(id); // internal use only
  }
}
