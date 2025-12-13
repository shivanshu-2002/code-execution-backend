import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/submit-code.dto';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  submit(
    @Req() req,
    @Body() submitCodeDto:CreateSubmissionDto
  ) {
    const {problemId,language,code} = submitCodeDto;
    console.log(`Execution starts for problem ${problemId} by user ${req.user.userId}`)
    return this.submissionService.submit(
      req.user.userId,
      problemId,
      language,
      code,
    );
  }
}
