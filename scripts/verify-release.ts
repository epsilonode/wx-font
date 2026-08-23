import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';

const packageInfo = JSON.parse(await readFile('package.json', 'utf8')) as { private: boolean; version: string };
const manifest = JSON.parse(await readFile('dist/release-manifest.json', 'utf8')) as {
  version: string;
  tag: string;
  assets: Array<{ path: string; bytes: number; sha256: string }>;
};

if (!packageInfo.private) throw new Error('GitHub-only releases require package.json private: true.');
if (manifest.version !== packageInfo.version || manifest.tag !== `v${packageInfo.version}`) throw new Error('Release manifest version does not match package.json.');
for (const asset of manifest.assets) {
  const file = await readFile(`dist/${asset.path}`);
  if ((await stat(`dist/${asset.path}`)).size !== asset.bytes) throw new Error(`Release manifest size mismatch for ${asset.path}.`);
  if (createHash('sha256').update(file).digest('hex') !== asset.sha256) throw new Error(`Release manifest integrity mismatch for ${asset.path}.`);
}

console.log(`Release bundle verification passed: ${manifest.tag}, ${manifest.assets.length} critical assets.`);
