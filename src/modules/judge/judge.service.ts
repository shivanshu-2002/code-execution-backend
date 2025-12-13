import { Injectable } from '@nestjs/common';

@Injectable()
export class JudgeService {
  judge(executionResult: any, testCases: any[]) {
    // Execution-level error (syntax, timeout, crash)
    if (executionResult.error) {
      if (executionResult.error.includes('timed out')) {
        return {
          status: 'TLE',
          executionTime: executionResult.executionTime,
        };
      }

      return {
        status: 'ERROR',
        executionTime: executionResult.executionTime,
        errorMessage: executionResult.error,
      };
    }
    console.log(JSON.stringify(executionResult));
    const results = executionResult.output;

    for (let i = 0; i < testCases.length; i++) {
      const expected = testCases[i].output;
      const actual = results[i];

      // Runtime error for specific test case
      if (actual?.error) {
        return {
          status: 'ERROR',
          executionTime: executionResult.executionTime,
          errorMessage: actual.error,
        };
      }

      // Deep compare output
      if (!this.isEqual(actual.output, expected)) {
        return {
          status: 'WRONG_ANSWER',
          executionTime: executionResult.executionTime,
        };
      }
    }

    return {
      status: 'ACCEPTED',
      executionTime: executionResult.executionTime,
    };
  }

  private isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
