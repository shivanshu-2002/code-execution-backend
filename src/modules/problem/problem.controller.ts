import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateProblemDto } from './dto/create-problem.dto';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get()
  getAll() {
    return this.problemService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.problemService.findById(id);
  }

  // TEMP: protect creation (admin later)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateProblemDto) {
    return this.problemService.create(body);
  }
}
