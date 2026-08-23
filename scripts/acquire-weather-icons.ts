import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const registry = JSON.parse(await readFile('src/registry.json', 'utf8'));
const outputDir = join('src', 'svg-raw', 'weather');
const rawBaseUrl = registry.weatherIconsInventory.sourceSvgBaseUrl.replace('github.com/erikflowers/weather-icons/blob/', 'raw.githubusercontent.com/erikflowers/weather-icons/');
const cloudFiles: Record<string, string> = {
  'wi-day-sunny': 'clear-day.svg', 'wi-night-clear': 'clear-night.svg',
  'wi-day-sunny-overcast': 'few-clouds-day.svg', 'wi-night-alt-partly-cloudy': 'few-clouds-night.svg',
  'wi-cloud': 'partly-cloudy.svg', 'wi-cloudy': 'mostly-cloudy.svg'
};

await mkdir(outputDir, { recursive: true });
for (const [className] of registry.weatherIconsInventory.pendingAcquisition) {
  const response = await fetch(`${rawBaseUrl}${className}.svg`);
  if (!response.ok) throw new Error(`Could not acquire ${className}: ${response.status}`);
  await writeFile(join(outputDir, cloudFiles[className] ?? `${className}.svg`), await response.text());
}

const overcast = await readFile('abstract/overcast.svg', 'utf8');
await writeFile(join(outputDir, 'overcast.svg'), overcast);
console.log(`Acquired ${registry.weatherIconsInventory.pendingAcquisition.length} Weather Icons SVGs and derived overcast.`);
