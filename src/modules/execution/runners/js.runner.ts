import { exec } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { v4 as uuid } from 'uuid';

export function runJavaScript(
  code: string,
  functionName: string,
  testCases: any[],
): Promise<any> {
  return new Promise((resolve) => {
    const fileName = `temp_${uuid()}.js`;
    console.log("Printing tests",testCases);
    const wrappedCode = `${code}
const tests = ${JSON.stringify(testCases)};
let results = [];

for (const t of tests) {
  try {
    const res = ${functionName}(...Object.values(t.input));
    results.push({ output: res });
  } catch (e) {
    results.push({ error: e.toString() });
  }
}

console.log(JSON.stringify(results));
`;

    writeFileSync(fileName, wrappedCode);

    const start = Date.now();

    exec(`node ${fileName}`, { timeout: 2000 }, (error, stdout, stderr) => {
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
