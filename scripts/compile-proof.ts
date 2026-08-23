import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generate as generateCss, parse as parseCss } from 'css-tree';
import { transform } from 'lightningcss';
import opentype from 'opentype.js';
import { optimize } from 'svgo';
import { z } from 'zod';

const glyphSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  file: z.string().endsWith('.svg'),
  canonicalClass: z.string().regex(/^wx-/),
  legacyClass: z.string().regex(/^wi-/),
  codepoint: z.string().regex(/^[0-9A-F]{4,6}$/),
  source: z.object({
    kind: z.literal('copied-weather-icons'),
    project: z.literal('Weather Icons 2.0.10'),
    author: z.literal('Erik Flowers'),
    designCredit: z.literal('Lukas Bischoff'),
    license: z.literal('SIL OFL 1.1'),
    sourceClass: z.literal('wi-day-sunny'),
    sourceUrl: z.url(),
    sourceBlobSha: z.string().regex(/^[a-f0-9]{40}$/),
    normalization: z.literal('Whitespace normalized; SVG path data preserved.')
  })
});

const registrySchema = z.object({
  glyphs: z.array(glyphSchema).length(1),
  wmoMappings: z.array(z.object({
    code: z.literal('00'),
    day: z.literal(true),
    okta: z.literal(0),
    glyphId: z.string()
  })).length(1)
});

const root = process.cwd();
const sourceDir = join(root, 'src', 'svg-raw', 'weather');
const outputDir = join(root, '.tmp', 'proof');
const svgOutputDir = join(outputDir, 'svg');
const fontOutputDir = join(outputDir, 'fonts');
const metaOutputDir = join(outputDir, 'meta');

const registry = registrySchema.parse(
  JSON.parse(await readFile(join(root, 'src', 'registry.json'), 'utf8'))
);
const codepoints = z.record(z.string(), z.string().regex(/^[0-9A-F]{4,6}$/)).parse(
  JSON.parse(await readFile(join(root, 'src', 'codepoints.json'), 'utf8'))
);
const glyph = registry.glyphs[0];
const mapping = registry.wmoMappings[0];

if (codepoints[glyph.id] !== glyph.codepoint || mapping.glyphId !== glyph.id) {
  throw new Error('Registry, codepoint manifest, and WMO proof mapping must agree.');
}

await rm(outputDir, { recursive: true, force: true });
await Promise.all([mkdir(svgOutputDir, { recursive: true }), mkdir(fontOutputDir, { recursive: true }), mkdir(metaOutputDir, { recursive: true })]);

const rawSvg = await readFile(join(sourceDir, glyph.file), 'utf8');
const optimizedSvg = optimize(rawSvg, { multipass: true, path: glyph.file });
if ('error' in optimizedSvg) throw new Error(optimizedSvg.error);
await writeFile(join(svgOutputDir, glyph.file), optimizedSvg.data);

const codepoint = Number.parseInt(glyph.codepoint, 16);
const compiler = Bun.spawn(['mise', 'exec', 'node@22', '--', 'node', 'scripts/generate-proof-font.mjs'], {
  cwd: root,
  stdout: 'inherit',
  stderr: 'inherit'
});
if (await compiler.exited !== 0) {
  throw new Error('Fantasticon compilation failed.');
}

const canonicalSelector = `.wx.${glyph.canonicalClass.split(' ').join('.')}`;
const readableCss = generateCss(parseCss(`
@font-face { font-family: "wx-font"; src: url("./fonts/wx-font.woff2") format("woff2"); }
.wx { font-family: "wx-font"; font-style: normal; }
${canonicalSelector}::before, .wx.wx-wmo-${mapping.code}.wx-day.wx-okta-${mapping.okta}::before { content: "\\${glyph.codepoint}"; }
`));
const productionCss = transform({
  filename: 'wx-icons.css',
  code: new TextEncoder().encode(readableCss),
  minify: true,
  cssModules: false
}).code;
await Promise.all([
  writeFile(join(outputDir, 'wx-icons.readable.css'), readableCss),
  writeFile(join(outputDir, 'wx-icons.css'), productionCss),
  writeFile(join(outputDir, 'registry.snapshot.json'), `${JSON.stringify(registry, null, 2)}\n`)
]);

const compiledFont = opentype.parse(await readFile(join(fontOutputDir, 'wx-font.ttf')).then((buffer) => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)));
if (!compiledFont.charToGlyphIndex(String.fromCodePoint(codepoint))) {
  throw new Error(`Compiled TTF is missing U+${glyph.codepoint}.`);
}

for (const file of [
  join(fontOutputDir, 'wx-font.ttf'),
  join(fontOutputDir, 'wx-font.woff2'),
  join(metaOutputDir, 'codepoints.json'),
  join(metaOutputDir, 'codepoints.ts'),
  join(outputDir, 'wx-icons.css')
]) {
  if ((await readFile(file)).byteLength === 0) throw new Error(`Generated empty artifact: ${file}`);
}

const generatedCodepoints = JSON.parse(await readFile(join(metaOutputDir, 'codepoints.json'), 'utf8'));
if (generatedCodepoints[glyph.id] !== codepoint) {
  throw new Error('Fantasticon did not preserve the fixed proof codepoint.');
}

console.log(`Compiler proof passed: ${glyph.id} at U+${glyph.codepoint}`);
