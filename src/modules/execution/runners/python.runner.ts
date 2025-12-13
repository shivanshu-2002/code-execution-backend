import { exec } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { v4 as uuid } from 'uuid';

export function runPython(
  code: string,
  functionName: string,
  testCases: any[],
): Promise<any> {
  return new Promise((resolve) => {
    const fileName = `temp_${uuid()}.py`;

    const wrappedCode = `
${code}

tests = ${JSON.stringify(testCases)}
results = []

for t in tests:
    try:
        res = ${functionName}(**t["input"])
        results.append({"output": res})
    except Exception as e:
        results.append({"error": str(e)})

import json
print(json.dumps(results))
`;

    writeFileSync(fileName, wrappedCode);

    const start = Date.now();

    exec(`python ${fileName}`, { timeout: 2000 }, (error, stdout, stderr) => {
      unlinkSync(fileName);

      if (error) {
        return resolve({
          error: error.message,
          executionTime: Date.now() - start,
        });
      }

      resolve({
        output: JSON.parse(stdout),
        executionTime: Date.now() - start,
      });
    });
  });
}
