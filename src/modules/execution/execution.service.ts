import { Injectable } from '@nestjs/common';
import { runJavaScript } from './runners/js.runner';
import { runPython } from './runners/python.runner';
import { runInDocker } from './runners/docker.runner';

@Injectable()
export class ExecutionService {
  async run(
    language: string,
    code: string,
    functionName: string,
    testCases: any[],
  ) {
    // *******************************Child process way***************************/
    // switch (language) {
    //   case 'javascript':
    //     return runJavaScript(code, functionName, testCases);
    //   case 'python':
    //     return runPython(code, functionName, testCases);
    //   default:
    //     throw new Error('Unsupported language');
    // }
    return runInDocker(language as any, code, functionName, testCases);
  }
}
