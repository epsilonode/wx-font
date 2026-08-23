import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';
import { readFile } from 'node:fs/promises';

// Fantasticon builds its glob with path.join; glob requires forward slashes on Windows.
const nativeJoin = path.join;
path.join = (...parts) => nativeJoin(...parts).replaceAll('\\', '/');
syncBuiltinESMExports();

const { FontAssetType, OtherAssetType, generateFonts } = await import('fantasticon');
const registry = JSON.parse(await readFile('src/registry.json', 'utf8'));
const glyph = registry.glyphs[0];

await generateFonts({
  inputDir: '.tmp/proof/svg',
  outputDir: '.tmp/proof',
  name: 'wx-font',
  fontTypes: [FontAssetType.TTF, FontAssetType.WOFF2],
  assetTypes: [OtherAssetType.JSON, OtherAssetType.TS],
  codepoints: { [glyph.id]: Number.parseInt(glyph.codepoint, 16) },
  getIconId: () => glyph.id,
  formatOptions: {
    json: { indent: 2 },
    ts: { types: ['constant', 'literalId'], singleQuotes: true }
  },
  pathOptions: {
    ttf: '.tmp/proof/fonts/wx-font.ttf',
    woff2: '.tmp/proof/fonts/wx-font.woff2',
    json: '.tmp/proof/meta/codepoints.json',
    ts: '.tmp/proof/meta/codepoints.ts'
  }
});
