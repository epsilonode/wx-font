import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const registrySchema = z.object({
  glyphs: z.array(z.object({ legacyClass: z.string(), codepoint: z.string(), source: z.object({ kind: z.literal('copied-weather-icons') }) })),
  weatherIconsInventory: z.object({
    pendingAcquisition: z.array(z.tuple([z.string().regex(/^wi-/), z.string().regex(/^[0-9A-F]{4}$/)])),
    derived: z.array(z.string().regex(/^wi-/))
  })
});

const [registryText, iconMap] = await Promise.all([
  readFile('src/registry.json', 'utf8'),
  readFile('abstract/icon-map.html', 'utf8')
]);
const registry = registrySchema.parse(JSON.parse(registryText));
const mappingSection = iconMap.slice(iconMap.indexOf('function getWeatherMapping'), iconMap.indexOf('// Resolves Font Glyph'));
const mappedClasses = new Set(mappingSection.match(/wi-[a-z0-9-]+/g) ?? []);
const approved = new Map(registry.glyphs.map(({ legacyClass, codepoint }) => [legacyClass, codepoint]));
const pending = new Map(registry.weatherIconsInventory.pendingAcquisition);
const knownClasses = new Set([...approved.keys(), ...pending.keys(), ...registry.weatherIconsInventory.derived]);

for (const className of mappedClasses) {
  if (!knownClasses.has(className)) throw new Error(`Missing provenance inventory for ${className}.`);
}
for (const [className, codepoint] of approved) {
  if (pending.has(className)) throw new Error(`${className} is both approved and pending.`);
  if (className === 'wi-day-sunny' && codepoint !== 'F00D') throw new Error('wi-day-sunny must retain U+F00D.');
}

console.log(`Registry audit passed: ${mappedClasses.size} mapped classes, ${approved.size} provenance-complete glyph`);
