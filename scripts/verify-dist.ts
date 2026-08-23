import { readFile } from 'node:fs/promises';
import { resolveWmo } from '../dist/wmo.js';

const [codepoints, css, directCss, compatCss, colorsCss, descriptionsCss] = await Promise.all([
  readFile('dist/codepoints.json', 'utf8').then(JSON.parse),
  readFile('dist/wx-wmo.css', 'utf8'),
  readFile('dist/wx-icons.css', 'utf8'),
  readFile('dist/wx-icons.compat.css', 'utf8'),
  readFile('dist/wx-icons.colors.css', 'utf8'),
  readFile('dist/wx-wmo.descriptions.css', 'utf8')
]);

for (let code = 0; code <= 99; code++) {
  for (const isDay of [true, false]) {
    for (const cloudPercent of [null, 0, 10, 50, 100]) {
      const result = resolveWmo(code, { isDay, cloudPercent });
      const glyph = result.glyph;
      if (!codepoints[glyph]) throw new Error(`WMO ${code} resolves to missing ${glyph}.`);
      const selector = `.wx-wmo-${String(code).padStart(2, '0')}.${isDay ? 'wx-day' : 'wx-night'}`;
      if (!css.includes(selector)) throw new Error(`Generated WMO CSS lacks ${selector}.`);
    }
  }
}

for (const [cloudPercent, category, ceilingRelevant, friendly, aviation] of [
  [0, 'CLR', false, 'wx-clear wx-day', 'wx-clr wx-day'],
  [10, 'FEW', false, 'wx-few-clouds wx-day', 'wx-few wx-day'],
  [30, 'SCT', false, 'wx-partly-cloudy', 'wx-sct'],
  [60, 'BKN', true, 'wx-mostly-cloudy', 'wx-bkn'],
  [90, 'OVC', true, 'wx-overcast', 'wx-ovc']
] as const) {
  const result = resolveWmo(0, { isDay: true, cloudPercent });
  if (result.cloudCategory !== category || result.ceilingRelevant !== ceilingRelevant || result.className !== friendly || result.aviationClassName !== aviation) {
    throw new Error(`Cloud metadata failed for ${cloudPercent}%.`);
  }
  for (const className of [friendly, aviation]) {
    const selector = `.wx.${className.split(' ').join('.')}`;
    if (!directCss.includes(selector)) throw new Error(`Generated CSS lacks ${selector}.`);
  }
}

const legacyClassByGlyph: Record<string, string> = {
  'clear-day': 'wi-day-sunny',
  'clear-night': 'wi-night-clear',
  'few-clouds-day': 'wi-day-sunny-overcast',
  'few-clouds-night': 'wi-night-alt-partly-cloudy',
  'partly-cloudy': 'wi-cloud',
  'mostly-cloudy': 'wi-cloudy'
};
for (const [glyph, codepoint] of Object.entries(codepoints as Record<string, number>)) {
  const legacyClass = legacyClassByGlyph[glyph] ?? `wi-${glyph}`;
  if (!compatCss.includes(`.${legacyClass}`) || !compatCss.includes(String.fromCodePoint(codepoint))) {
    throw new Error(`Compatibility CSS lacks ${legacyClass}.`);
  }
}
if (!colorsCss.includes('--wx-sunny') || !colorsCss.includes('--wx-overcast')) throw new Error('Generated color CSS lacks semantic tokens.');
if (!descriptionsCss.includes('--wx-description') || !descriptionsCss.includes('wx-wmo-60')) throw new Error('Generated description CSS lacks WMO descriptions.');

for (const [code, glyph, descriptor] of [
  [5, 'day-haze', 'Haze'],
  [85, 'snow-wind', 'Snow showers'],
  [86, 'snow-wind', 'Snow showers'],
  [89, 'hail', 'Ice pellets or hail showers'],
  [90, 'hail', 'Ice pellets or hail showers'],
  [91, 'rain', 'Rain; thunderstorm during preceding hour'],
  [93, 'rain-mix', 'Snow/rain mix or hail; thunderstorm during preceding hour'],
  [95, 'thunderstorm', 'Active thunderstorm without hail'],
  [96, 'hail', 'Active thunderstorm with hail'],
  [97, 'thunderstorm', 'Heavy thunderstorm without hail'],
  [98, 'thunderstorm', 'Active thunderstorm with dust/sandstorm'],
  [99, 'hail', 'Heavy thunderstorm with hail']
] as const) {
  const codepoint = String.fromCodePoint((codepoints as Record<string, number>)[glyph]);
  for (const isDay of [true, false]) {
    const state = isDay ? 'wx-day' : 'wx-night';
    const result = resolveWmo(code, { isDay });
    if (result.glyph !== glyph || result.descriptor !== descriptor) throw new Error(`WMO ${code} ${state} resolver fixture failed.`);
    const selector = `.wx.wx-wmo-${String(code).padStart(2, '0')}.${state}:before`;
    const ruleStart = css.indexOf(selector);
    const ruleEnd = css.indexOf('}', ruleStart);
    if (ruleStart === -1 || ruleEnd === -1 || !css.slice(ruleStart, ruleEnd).includes(codepoint)) {
      throw new Error(`WMO ${code} ${state} CSS codepoint fixture failed.`);
    }
  }
  const descriptionSelector = `.wx.wx-wmo-${String(code).padStart(2, '0')}`;
  const descriptionStart = descriptionsCss.indexOf(descriptionSelector);
  const descriptionEnd = descriptionsCss.indexOf('}', descriptionStart);
  if (descriptionStart === -1 || descriptionEnd === -1 || !descriptionsCss.slice(descriptionStart, descriptionEnd).includes(`--wx-description:"${descriptor}"`)) {
    throw new Error(`WMO ${code} description CSS fixture failed.`);
  }
}

console.log('Distribution WMO resolver, cloud metadata, compatibility, color, description, and 4677 fixtures passed.');
