import { Injectable } from '@nestjs/common';
import { runJavaScript } from './runners/js.runner';
import { runPython } from './runners/python.runner';

@Injectable()
export class ExecutionService {
  async run(
    language: string,
    code: string,
    functionName: string,
    testCases: any[],
  ) {
    switch (language) {
      case 'javascript':
        return runJavaScript(code, functionName, testCases);
      case 'python':
        return runPython(code, functionName, testCases);
      default:
        throw new Error('Unsupported language');
    }
  }
}
