import { execFile } from 'child_process';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

/**
 * Convert Windows path to Docker-compatible path
 * C:\Users\name\proj  ->  /c/Users/name/proj
 */
function toDockerPath(p: string): string {
  return p
    .replace(/\\/g, '/')
    .replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
}

//Docker was not able to identify the files due to file system issue of windows
// 🔑 The “hack” that fixed it
// 1️⃣ Path conversion (this is the BIG one)
// I converted:
// C:\Users\pshiv\proj
// ➡️ into:
// /c/Users/pshiv/proj
// Docker FINALLY saw your files.

export function runInDocker(
  language: 'javascript' | 'python',
  code: string,
  functionName: string,
  testCases: any[],
): Promise<any> {
  return new Promise((resolve) => {
    const id = uuid();
    const hostDir = path.join(process.cwd(), 'tmp', id);
    const dockerDir = toDockerPath(hostDir);

    mkdirSync(hostDir, { recursive: true });

    const fileName = language === 'javascript' ? 'main.js' : 'main.py';
    const image = language === 'javascript'
      ? 'code-runner-js'
      : 'code-runner-py';

    const wrappedCode =
      language === 'javascript'
        ? wrapJS(code, functionName, testCases)
        : wrapPython(code, functionName, testCases);

    writeFileSync(path.join(hostDir, fileName), wrappedCode);

    const start = Date.now();

    //     exec runs a command through a shell.
    // execFile runs a program directly (no shell).
    execFile(
      'docker',
      [
        'run',
        '--rm',
        '--memory=128m',
        '--cpus=0.5',
        '--network', 'none',
        '-v', `${dockerDir}:/app`,
        image,
      ],
      { timeout: 2000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {

        rmSync(hostDir, { recursive: true, force: true });

        const executionTime = Date.now() - start;

        if (error) {
          return resolve({
            error: error.killed ? 'Time Limit Exceeded' : error.message,
            stderr,
            executionTime,
          });
        }

        const raw = stdout.toString().trim();

        if (!raw) {
          return resolve({
            error: 'No JSON output produced',
            executionTime,
          });
        }

        try {
          const output = JSON.parse(raw);
          return resolve({ output, executionTime });
        } catch {
          return resolve({
            error: 'Invalid JSON output',
            rawOutput: raw,
            executionTime,
          });
        }
      }
    );
  });
}

/* ---------- WRAPPERS ---------- */

function wrapJS(code: string, functionName: string, testCases: any[]) {
  return `
try {
${code}

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
} catch (e) {
  console.log(JSON.stringify([{ error: "Runtime Error", details: e.toString() }]));
}
`;
}

function wrapPython(code: string, functionName: string, testCases: any[]) {
  return `
try:
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
except Exception as e:
    import json
    print(json.dumps([{"error": "Runtime Error", "details": str(e)}]))
`;
}
