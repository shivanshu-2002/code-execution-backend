// create-problem.dto.ts
import {
  IsString,
  IsArray,
  IsIn,
  ValidateNested,
  IsObject,
  isObject,
  IsNotEmpty,
  isString,
} from 'class-validator';
import { Type } from 'class-transformer';

// starter-code.dto.ts
export class StarterCodeDto {
  @IsString()
  javascript: string;

  @IsString()
  python: string;
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
  @IsNotEmpty()
  exampleTestCases: any[];

  @IsString()
  followup:string;

  @IsArray()
  @IsString({each:true})
  constraints:string[];

  @IsArray()
  @IsNotEmpty()
  hiddenTestCases: any[];
}
