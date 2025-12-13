import { IsString, IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  problemId: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
