import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';
import { readFile } from 'node:fs/promises';

const nativeJoin = path.join;
path.join = (...parts) => nativeJoin(...parts).replaceAll('\\', '/');
syncBuiltinESMExports();

const { FontAssetType, OtherAssetType, generateFonts } = await import('fantasticon');
const codepoints = JSON.parse(await readFile('src/codepoints.json', 'utf8'));
await generateFonts({
  inputDir: 'dist/svg/weather',
  outputDir: 'dist',
  name: 'wx-font',
  fontTypes: [FontAssetType.TTF, FontAssetType.WOFF2],
  assetTypes: [OtherAssetType.JSON, OtherAssetType.TS],
  codepoints: Object.fromEntries(Object.entries(codepoints).map(([id, value]) => [id, Number.parseInt(value, 16)])),
  getIconId: ({ basename }) => basename.replace(/^wi-/, ''),
  formatOptions: { json: { indent: 2 }, ts: { types: ['constant', 'literalId'], singleQuotes: true } },
  pathOptions: {
    ttf: 'dist/fonts/wx-font.ttf', woff2: 'dist/fonts/wx-font.woff2',
    json: 'dist/codepoints.json', ts: 'dist/codepoints.ts'
  }
});
