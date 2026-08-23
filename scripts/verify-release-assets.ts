import { readFile } from 'node:fs/promises';

const packageInfo = JSON.parse(await readFile('package.json', 'utf8')) as { version: string };
const ref = process.argv[2] ?? `v${packageInfo.version}`;
const baseUrl = `https://esm.sh/gh/epsilonode/wx-font@${ref}/dist`;
const manifestUrl = `${baseUrl}/release-manifest.json`;
const manifestResponse = await fetch(manifestUrl);
if (!manifestResponse.ok) throw new Error(`Could not fetch ${manifestUrl}: ${manifestResponse.status}.`);
const manifest = await manifestResponse.json() as { assets: Array<{ path: string }> };

for (const asset of manifest.assets) {
  const url = `${baseUrl}/${asset.path}`;
  const response = await fetch(url);
  if (!response.ok || (await response.arrayBuffer()).byteLength === 0) throw new Error(`Could not fetch release asset ${url}.`);
}

const cssUrl = `${baseUrl}/wx-icons.css`;
const css = await (await fetch(cssUrl)).text();
const fontPath = css.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
if (!fontPath) throw new Error('Hosted wx-icons.css does not reference a font.');
const fontResponse = await fetch(new URL(fontPath, cssUrl));
if (!fontResponse.ok || (await fontResponse.arrayBuffer()).byteLength === 0) throw new Error('Hosted CSS font URL is not fetchable.');

console.log(`esm.sh release asset verification passed for ${ref}: ${manifest.assets.length} assets.`);
