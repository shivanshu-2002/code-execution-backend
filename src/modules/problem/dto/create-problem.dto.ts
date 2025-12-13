// create-problem.dto.ts
import {
  IsString,
  IsArray,
  IsIn,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

// starter-code.dto.ts
export class StarterCodeDto {
  @IsString()
  javascript: string;

  @IsString()
  python: string;
}

// test-case.dto.ts
export class TestCaseDto {
  @IsObject()
  input: Record<string, any>;

  @IsArray()
  output: any[];
}



export class CreateProblemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn(['easy', 'medium', 'hard'])
  difficulty: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  functionName: string;

  @IsObject()
  @ValidateNested()
  @Type(() => StarterCodeDto)
  starterCode: StarterCodeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  exampleTestCases: TestCaseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  hiddenTestCases: TestCaseDto[];
}
