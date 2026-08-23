import { readFile } from 'node:fs/promises';

const registry = JSON.parse(await readFile('src/registry.json', 'utf8'));
const codepoints = JSON.parse(await readFile('src/codepoints.json', 'utf8')) as Record<string, string>;
const source = registry.provenance.sources['weather-icons-2.0.10'];
const response = await fetch(`https://api.github.com/repos/erikflowers/weather-icons/git/trees/${source.treeSha}?recursive=1`);
if (!response.ok) throw new Error(`Could not load pinned Weather Icons tree: ${response.status}`);
const tree = await response.json() as { tree: Array<{ path: string; sha: string }> };
const blobs = new Map(tree.tree.map(({ path, sha }) => [path, sha]));
const upstream = [
  ['wi-day-sunny', 'F00D'],
  ...registry.weatherIconsInventory.pendingAcquisition
] as Array<[string, string]>;

for (const [sourceClass, codepoint] of upstream) {
  const sourceFile = `${sourceClass}.svg`;
  const sourcePath = `${source.svgDirectory}/${sourceFile}`;
  const blobSha = blobs.get(sourcePath);
  const glyph = sourceClass.replace(/^wi-/, '');
  const localFile = registry.provenance.localFileBySourceClass[sourceClass] ?? sourceFile;
  const localGlyph = localFile.replace(/\.svg$/, '').replace(/^wi-/, '');
  if (!blobSha || !/^[a-f0-9]{40}$/.test(blobSha)) throw new Error(`Missing upstream blob for ${sourcePath}.`);
  if (codepoints[localGlyph] !== codepoint) throw new Error(`Codepoint mismatch for ${sourceClass}.`);
}

const overcast = registry.provenance.projectGenerated.overcast;
if (codepoints.overcast !== overcast.codepoint || overcast.generator !== 'Gemini') throw new Error('Invalid project-generated overcast provenance.');
console.log(`Provenance audit passed: ${upstream.length} Weather Icons blobs pinned to ${source.treeSha}, 1 Gemini-generated glyph.`);
