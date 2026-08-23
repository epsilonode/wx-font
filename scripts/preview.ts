import { spawn } from 'node:child_process';

const build = spawn('mise', ['run', 'icon-build'], { stdio: 'inherit' });
const exitCode = await new Promise<number>((resolve, reject) => {
  build.once('error', reject);
  build.once('exit', (code) => resolve(code ?? 1));
});

if (exitCode !== 0) throw new Error('Preview build failed.');

console.log('Preview generated at dist/preview.html. Serve the project over HTTP to view it.');
