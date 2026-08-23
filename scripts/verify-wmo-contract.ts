import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const contractSchema = z.object({
  cloudNormalization: z.array(z.object({
    maximumPercent: z.number().nullable(), okta: z.number(), descriptor: z.string(), dayGlyph: z.string(), nightGlyph: z.string()
  })),
  dynamicRules: z.array(z.object({
    codes: z.tuple([z.number(), z.number()]), usesCloudCoverWhenValid: z.literal(true), fallbackDayGlyph: z.string(), fallbackNightGlyph: z.string()
  })),
  staticRules: z.array(z.tuple([z.number(), z.number(), z.string(), z.string()])),
  staticDescriptions: z.array(z.tuple([z.number(), z.number(), z.string()])),
  fixtures: z.array(z.object({
    code: z.number(), isDay: z.boolean(), cloudPercent: z.number().nullable(), expectedOkta: z.number().nullable(), expectedClass: z.string(), expectedDescription: z.string().optional()
  }))
});

const registry = JSON.parse(await readFile('src/registry.json', 'utf8'));
const contract = contractSchema.parse(registry.wmoContract);
const codepoints = JSON.parse(await readFile('src/codepoints.json', 'utf8')) as Record<string, string>;
const assertPackaged = (glyph: string) => {
  if (!codepoints[glyph.replace(/^wi-/, '')]) throw new Error(`${glyph} does not resolve to a packaged glyph.`);
};

const normalizeCloud = (percent: number | null) => {
  if (percent === null || !Number.isFinite(percent) || percent < 0) return null;
  return contract.cloudNormalization.find(({ maximumPercent }) => maximumPercent === null || percent <= maximumPercent) ?? null;
};

for (const fixture of contract.fixtures) {
  const dynamicRule = contract.dynamicRules.find(({ codes }) => fixture.code >= codes[0] && fixture.code <= codes[1]);
  const staticRule = contract.staticRules.find(([start, end]) => fixture.code >= start && fixture.code <= end);
  const cloud = dynamicRule ? normalizeCloud(fixture.cloudPercent) : null;
  const className = cloud
    ? fixture.isDay ? cloud.dayGlyph : cloud.nightGlyph
    : dynamicRule
      ? fixture.isDay ? dynamicRule.fallbackDayGlyph : dynamicRule.fallbackNightGlyph
      : staticRule
        ? fixture.isDay ? staticRule[2] : staticRule[3]
        : null;
  const description = cloud?.descriptor ?? (dynamicRule ? null : contract.staticDescriptions.find(([start, end]) => fixture.code >= start && fixture.code <= end)?.[2] ?? null);
  if ((cloud?.okta ?? null) !== fixture.expectedOkta || className !== fixture.expectedClass || (fixture.expectedDescription !== undefined && description !== fixture.expectedDescription)) {
    throw new Error(`Fixture failed for WMO ${fixture.code}.`);
  }
}

for (let code = 0; code <= 99; code++) {
  const dynamic = contract.dynamicRules.find(({ codes }) => code >= codes[0] && code <= codes[1]);
  const staticRule = contract.staticRules.find(([start, end]) => code >= start && code <= end);
  if (!dynamic && !staticRule) throw new Error(`WMO ${code} has no resolver rule.`);
  if (dynamic) {
    assertPackaged(dynamic.fallbackDayGlyph);
    assertPackaged(dynamic.fallbackNightGlyph);
  }
  if (staticRule) {
    assertPackaged(staticRule[2]);
    assertPackaged(staticRule[3]);
  }
}
for (const cloud of contract.cloudNormalization) {
  assertPackaged(cloud.dayGlyph);
  assertPackaged(cloud.nightGlyph);
}

console.log(`WMO mapping proof passed: ${contract.fixtures.length} fixtures and WMO 00-99 coverage`);
