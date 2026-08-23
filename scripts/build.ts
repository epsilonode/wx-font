import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generate as generateCss, parse as parseCss } from 'css-tree';
import { transform } from 'lightningcss';
import opentype from 'opentype.js';
import { optimize } from 'svgo';

const root = process.cwd();
const sourceDir = join(root, 'src/svg-raw/weather');
const outputDir = join(root, 'dist');
const stagedDir = join(outputDir, 'svg/weather');
const codepoints = JSON.parse(await readFile(join(root, 'src/codepoints.json'), 'utf8')) as Record<string, string>;
const registry = JSON.parse(await readFile(join(root, 'src/registry.json'), 'utf8'));
const packageInfo = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { version: string };
const contract = registry.wmoContract;
const publicContract = {
  ...contract,
  staticRules: contract.staticRules.map(([start, end, dayGlyph, nightGlyph]: [number, number, string, string]) => [
    start, end, dayGlyph.replace(/^wi-/, ''), nightGlyph.replace(/^wi-/, '')
  ])
};
await rm(outputDir, { recursive: true, force: true });
await Promise.all([mkdir(stagedDir, { recursive: true }), mkdir(join(outputDir, 'fonts'), { recursive: true })]);

for (const file of await readdir(sourceDir)) {
  if (!file.endsWith('.svg')) continue;
  const result = optimize(await readFile(join(sourceDir, file), 'utf8'), { multipass: true, path: file });
  if ('error' in result) throw new Error(result.error);
  await writeFile(join(stagedDir, file), result.data);
}
if ((await readdir(stagedDir)).length !== Object.keys(codepoints).length) throw new Error('Every declared codepoint must have one source SVG.');

const compiler = Bun.spawn(['mise', 'exec', 'node@22', '--', 'node', 'scripts/generate-font.mjs'], { cwd: root, stdout: 'inherit', stderr: 'inherit' });
if (await compiler.exited !== 0) throw new Error('Font compilation failed.');

const publicClasses: Record<string, { friendly: string[]; aviation: string[]; category: string; ceilingRelevant: boolean }> = {};
for (const cloud of contract.cloudNormalization) {
  const dayModifier = cloud.dayGlyph === cloud.nightGlyph ? [] : ['wx-day'];
  const nightModifier = cloud.dayGlyph === cloud.nightGlyph ? [] : ['wx-night'];
  publicClasses[cloud.dayGlyph] = {
    friendly: [cloud.friendlyModifier, ...dayModifier],
    aviation: [cloud.aviationModifier, ...dayModifier],
    category: cloud.category,
    ceilingRelevant: cloud.ceilingRelevant
  };
  publicClasses[cloud.nightGlyph] = {
    friendly: [cloud.friendlyModifier, ...nightModifier],
    aviation: [cloud.aviationModifier, ...nightModifier],
    category: cloud.category,
    ceilingRelevant: cloud.ceilingRelevant
  };
}
const glyphId = (value: string) => value.replace(/^wi-/, '');
const sourceClassFor = (id: string) => {
  if (id === 'overcast') return 'wi-overcast';
  const matchingSource = Object.entries(registry.provenance.localFileBySourceClass).find(([, file]) => glyphId(file.replace(/\.svg$/, '')) === id);
  return matchingSource?.[0] ?? `wi-${id}`;
};
const classVariantsFor = (id: string) => {
  const classes = publicClasses[id];
  return classes ? [classes.friendly, classes.aviation] : [[`wx-${id}`]];
};
const selectorFor = (id: string) => classVariantsFor(id).map((classes) => `.wx.${classes.join('.')}::before`).join(',');
const contentFor = (value: string) => `\\${codepoints[glyphId(value)]}`;
const rules = Object.keys(codepoints).map((id) => `${selectorFor(id)}{content:"${contentFor(id)}"}`).join('');
const compatibilityRules = Object.keys(codepoints).map((id) => `.wi.${sourceClassFor(id)}::before{content:"${contentFor(id)}"}`).join('');
const toneFor = (id: string) => {
  if (id.includes('clear') || id.includes('sunny')) return 'sunny';
  if (id.includes('rain') || id === 'showers' || id === 'sprinkle') return 'rain';
  if (id.includes('snow') || id === 'sleet' || id === 'hail') return 'snow';
  if (id.includes('thunder') || id === 'lightning') return 'thunder';
  if (id.includes('fog') || id === 'smoke' || id.includes('haze')) return 'fog';
  return 'overcast';
};
const colorRules = Object.keys(codepoints).map((id) => `${selectorFor(id)}{color:var(--wx-${toneFor(id)})}`).join('');
const dynamicWmoCss = contract.dynamicRules.flatMap((rule: { codes: [number, number]; fallbackDayGlyph: string; fallbackNightGlyph: string }) =>
  Array.from({ length: rule.codes[1] - rule.codes[0] + 1 }, (_, offset) => {
    const code = String(rule.codes[0] + offset).padStart(2, '0');
    return [
      `.wx.wx-wmo-${code}.wx-day::before{content:"${contentFor(rule.fallbackDayGlyph)}"}`,
      `.wx.wx-wmo-${code}.wx-night::before{content:"${contentFor(rule.fallbackNightGlyph)}"}`,
      ...contract.cloudNormalization.flatMap((cloud: { okta: number; dayGlyph: string; nightGlyph: string }) => [
        `.wx.wx-wmo-${code}.wx-day.wx-okta-${cloud.okta}::before{content:"${contentFor(cloud.dayGlyph)}"}`,
        `.wx.wx-wmo-${code}.wx-night.wx-okta-${cloud.okta}::before{content:"${contentFor(cloud.nightGlyph)}"}`
      ])
    ];
  })
).flat(2).join('');
const staticWmoCss = contract.staticRules.flatMap(([start, end, dayGlyph, nightGlyph]: [number, number, string, string]) =>
  Array.from({ length: end - start + 1 }, (_, offset) => {
    const code = String(start + offset).padStart(2, '0');
    return [
      `.wx.wx-wmo-${code}.wx-day::before{content:"${contentFor(dayGlyph)}"}`,
      `.wx.wx-wmo-${code}.wx-night::before{content:"${contentFor(nightGlyph)}"}`
    ];
  })
).flat(2).join('');
const descriptionFor = (code: number) => {
  const dynamic = contract.dynamicRules.find((rule: { codes: [number, number] }) => code >= rule.codes[0] && code <= rule.codes[1]);
  if (dynamic) return 'Cloudy Conditions';
  return contract.staticDescriptions.find(([start, end]: [number, number, string]) => code >= start && code <= end)?.[2] ?? '';
};
const descriptionRules = Array.from({ length: 100 }, (_, code) => {
  const selector = `.wx.wx-wmo-${String(code).padStart(2, '0')}`;
  const base = `${selector}{--wx-description:"${descriptionFor(code)}"}`;
  const dynamic = contract.dynamicRules.some((rule: { codes: [number, number] }) => code >= rule.codes[0] && code <= rule.codes[1]);
  if (!dynamic) return base;
  return `${base}${contract.cloudNormalization.map((cloud: { okta: number; descriptor: string }) => `${selector}.wx-okta-${cloud.okta}{--wx-description:"${cloud.descriptor}"}`).join('')}`;
}).join('');
const readableCss = generateCss(parseCss(`@font-face{font-family:"wx-font";src:url("./fonts/wx-font.woff2") format("woff2")} .wx{font-family:"wx-font";font-style:normal}${rules}`));
const css = transform({ filename: 'wx-icons.css', code: new TextEncoder().encode(readableCss), minify: true, cssModules: false }).code;
const readableCompatCss = generateCss(parseCss(`@font-face{font-family:"wx-font";src:url("./fonts/wx-font.woff2") format("woff2")} .wi{font-family:"wx-font";font-style:normal}${compatibilityRules}`));
const compatCss = transform({ filename: 'wx-icons.compat.css', code: new TextEncoder().encode(readableCompatCss), minify: true, cssModules: false }).code;
const readableColorsCss = generateCss(parseCss(`:root{--wx-sunny:#d97706;--wx-rain:#2563eb;--wx-snow:#0891b2;--wx-thunder:#7c3aed;--wx-fog:#64748b;--wx-overcast:#475569}.wx{color:var(--wx-color,currentColor)}${colorRules}`));
const colorsCss = transform({ filename: 'wx-icons.colors.css', code: new TextEncoder().encode(readableColorsCss), minify: true, cssModules: false }).code;
const readableWmoCss = generateCss(parseCss(`.wx[class*="wx-wmo-"]{font-family:"wx-font";font-style:normal}${dynamicWmoCss}${staticWmoCss}`));
const wmoCss = transform({ filename: 'wx-wmo.css', code: new TextEncoder().encode(readableWmoCss), minify: true, cssModules: false }).code;
const readableDescriptionsCss = generateCss(parseCss(`.wx[class*="wx-wmo-"]{--wx-description:""}.wx.wx-wmo-description::after{content:var(--wx-description);font-family:inherit;font-style:normal;margin-inline-start:.35em}${descriptionRules}`));
const descriptionsCss = transform({ filename: 'wx-wmo.descriptions.css', code: new TextEncoder().encode(readableDescriptionsCss), minify: true, cssModules: false }).code;
const resolver = `const contract=${JSON.stringify(publicContract)};\nconst publicClasses=${JSON.stringify(publicClasses)};\nconst classNamesFor=(glyph)=>{const classes=publicClasses[glyph];return classes?{className:classes.friendly.join(' '),aviationClassName:classes.aviation.join(' '),cloudCategory:classes.category,ceilingRelevant:classes.ceilingRelevant}:{className:'wx-'+glyph,aviationClassName:null,cloudCategory:null,ceilingRelevant:false}};\nexport const normalizeCloudCover=(percent)=>{if(!Number.isFinite(percent)||percent<0)return null;return contract.cloudNormalization.find((entry)=>entry.maximumPercent===null||percent<=entry.maximumPercent)??null};\nexport const resolveWmo=(code,{isDay=true,cloudPercent=null}={})=>{if(!Number.isInteger(code)||code<0||code>99)throw new RangeError('WMO code must be an integer from 0 through 99');const dynamic=contract.dynamicRules.find((rule)=>code>=rule.codes[0]&&code<=rule.codes[1]);const cloud=dynamic?normalizeCloudCover(cloudPercent):null;const staticRule=contract.staticRules.find(([start,end])=>code>=start&&code<=end);const glyph=cloud?(isDay?cloud.dayGlyph:cloud.nightGlyph):dynamic?(isDay?dynamic.fallbackDayGlyph:dynamic.fallbackNightGlyph):(isDay?staticRule[2]:staticRule[3]);const descriptor=cloud?.descriptor??(dynamic?'Cloudy Conditions':contract.staticDescriptions.find(([start,end])=>code>=start&&code<=end)?.[2]??null);return {glyph,...classNamesFor(glyph),okta:cloud?.okta??null,descriptor}};\nexport {contract as wmoContract};\n`;
const declarations = `export type CloudCategory='CLR'|'FEW'|'SCT'|'BKN'|'OVC';\nexport type WmoResolution={glyph:string;className:string;aviationClassName:string|null;cloudCategory:CloudCategory|null;ceilingRelevant:boolean;okta:number|null;descriptor:string|null};\nexport function normalizeCloudCover(percent:number|null):{maximumPercent:number|null;okta:number;descriptor:string;category:CloudCategory;friendlyModifier:string;aviationModifier:string;ceilingRelevant:boolean;dayGlyph:string;nightGlyph:string}|null;\nexport function resolveWmo(code:number,options?:{isDay?:boolean;cloudPercent?:number|null}):WmoResolution;\nexport const wmoContract:object;\n`;
const preview = `<!doctype html><html><head><meta charset="utf-8"><title>wx-font preview</title><link rel="stylesheet" href="./wx-icons.css"><link rel="stylesheet" href="./wx-wmo.css"><style>body{font:16px system-ui;margin:2rem}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));gap:1rem}.wx{font-size:2rem}article{border:1px solid #ddd;padding:.75rem}small{display:block}</style></head><body><h1>wx-font WMO preview</h1><main id="icons"></main><script type="module">import{resolveWmo}from'./wmo.js';const main=document.querySelector('#icons');for(let code=0;code<=99;code++){const value=String(code).padStart(2,'0');const result=resolveWmo(code,{isDay:true,cloudPercent:50});main.insertAdjacentHTML('beforeend','<article><i class="wx wx-wmo-'+value+' wx-day wx-okta-4"></i><small>'+value+'</small><small>'+result.className+'</small><small>'+String(result.cloudCategory??'')+'</small></article>')}</script></body></html>`;
const sourceTable = Object.keys(codepoints).map((id) => `| ${id} | ${sourceClassFor(id)} | ${id === 'overcast' ? 'Derived project glyph' : 'Weather Icons 2.0.10'} |`).join('\n');
const releaseTag = `v${packageInfo.version}`;
const releaseBaseUrl = `https://esm.sh/gh/epsilonode/wx-font@${releaseTag}/dist`;
const readme = `# @epsilonode/wx-font\n\nFocused registry-driven weather icon font for web, DOCX, PPTX, and PDF pipelines.\n\n## Hosted Release\n\nThis project publishes immutable GitHub tags and serves them through esm.sh. Pin a release tag or commit SHA; do not use \`main\` as a consumer URL.\n\n    import { resolveWmo } from '${releaseBaseUrl}/wmo.js';\n    resolveWmo(0, { isDay: true, cloudPercent: 18 });\n\n## CSS\n\n    <link rel="stylesheet" href="${releaseBaseUrl}/wx-icons.css">\n    <link rel="stylesheet" href="${releaseBaseUrl}/wx-wmo.css">\n\nOptional layers are \`wx-icons.compat.css\`, \`wx-icons.colors.css\`, and \`wx-wmo.descriptions.css\`. Font, SVG, JSON, and contract paths are listed with integrity hashes in \`release-manifest.json\`.\n\n    <i class="wx wx-few-clouds wx-night"></i>\n    <i class="wi wi-night-alt-partly-cloudy"></i>\n    <i class="wx wx-wmo-00 wx-day wx-okta-2"></i>\n    <span class="wx wx-wmo-60 wx-day wx-wmo-description"></span>\n\nWMO selectors use \`wx-day\` or \`wx-night\`; dynamic cloud states additionally use \`wx-okta-0\` through \`wx-okta-8\`.\n\n## Documents\n\nUse \`wx-font.woff2\` for web and \`wx-font.ttf\` with \`codepoints.json\` for DOCX/PPTX generators. Document tools must embed or install the TTF according to their own API.\n\n## Glyph Sources\n\n| Glyph | Compatibility class | Source |\n| --- | --- | --- |\n${sourceTable}\n\n## Attribution\n\n27 glyphs are pinned to Weather Icons 2.0.10 by Erik Flowers, with original icon designs by Lukas Bischoff, under SIL OFL 1.1. The filled \`overcast\` glyph is project-generated and uses U+E900. See \`NOTICE\` and \`LICENSE\`.\n`;
const notice = `This distribution uses 27 glyphs from Weather Icons 2.0.10, credited to Erik Flowers with original icon designs by Lukas Bischoff. The upstream font is licensed under SIL OFL 1.1. Upstream blobs are pinned and verified by the provenance audit. The filled overcast glyph is project-generated and is assigned U+E900.\n`;
await Promise.all([
    writeFile(join(outputDir, 'wx-icons.css'), css),
    writeFile(join(outputDir, 'wx-icons.readable.css'), readableCss),
    writeFile(join(outputDir, 'wx-icons.compat.css'), compatCss),
    writeFile(join(outputDir, 'wx-icons.compat.readable.css'), readableCompatCss),
    writeFile(join(outputDir, 'wx-icons.colors.css'), colorsCss),
    writeFile(join(outputDir, 'wx-icons.colors.readable.css'), readableColorsCss),
    writeFile(join(outputDir, 'wx-wmo.css'), wmoCss),
    writeFile(join(outputDir, 'wx-wmo.readable.css'), readableWmoCss),
    writeFile(join(outputDir, 'wx-wmo.descriptions.css'), descriptionsCss),
    writeFile(join(outputDir, 'wx-wmo.descriptions.readable.css'), readableDescriptionsCss),
  writeFile(join(outputDir, 'wmo.js'), resolver),
  writeFile(join(outputDir, 'wmo.d.ts'), declarations),
  writeFile(join(outputDir, 'index.js'), `export * from './wmo.js';\n`),
  writeFile(join(outputDir, 'index.d.ts'), `export * from './wmo.js';\n`),
  writeFile(join(outputDir, 'preview.html'), preview),
  writeFile(join(outputDir, 'registry.snapshot.json'), `${JSON.stringify(registry, null, 2)}\n`),
  writeFile(join(outputDir, 'wmo-contract.json'), `${JSON.stringify(publicContract, null, 2)}\n`),
  writeFile(join(root, 'README.md'), readme),
  writeFile(join(root, 'NOTICE'), notice)
]);
const releaseAssetPaths = [
  'wmo.js',
  'wx-icons.css',
  'wx-icons.compat.css',
  'wx-icons.colors.css',
  'wx-wmo.css',
  'wx-wmo.descriptions.css',
  'fonts/wx-font.woff2',
  'fonts/wx-font.ttf',
  'codepoints.json',
  'wmo-contract.json',
  'svg/weather/wi-hail.svg'
];
const releaseAssets = await Promise.all(releaseAssetPaths.map(async (path) => {
  const file = await readFile(join(outputDir, path));
  return { path, bytes: (await stat(join(outputDir, path))).size, sha256: createHash('sha256').update(file).digest('hex') };
}));
await writeFile(join(outputDir, 'release-manifest.json'), `${JSON.stringify({ version: packageInfo.version, tag: releaseTag, glyphCount: Object.keys(codepoints).length, assets: releaseAssets }, null, 2)}\n`);
const fontBuffer = await readFile(join(outputDir, 'fonts/wx-font.ttf'));
const font = opentype.parse(fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength));
for (const [id, hex] of Object.entries(codepoints)) if (!font.charToGlyphIndex(String.fromCodePoint(Number.parseInt(hex, 16)))) throw new Error(`TTF is missing ${id}.`);
console.log(`Built ${Object.keys(codepoints).length} glyphs into dist.`);
