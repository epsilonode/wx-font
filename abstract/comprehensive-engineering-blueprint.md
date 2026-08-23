# Comprehensive Engineering Blueprint: WMO Weather Icon Font & CDN Architecture

## 1. Project Origin & Architectural Shift

The original prototype (`icon-map.html`) operated as a single-file UI dashboard using a hybrid asset approach: embedded, multi-layered SVGs for complex weather states and hosted Cloudflare CDNs for generic typography and UI icons.

While effective for a standalone utility, embedding massive vector graphics inline introduces unnecessary memory overhead and limits reusability. For operational forecasting guides—especially where maritime and aviation safety dashboards across Southeast Asia and the Pacific require immediate, unblocked rendering—decoupling these assets is critical.

The new architecture migrates this system into a globally distributed NPM package. This ensures that the custom compiled icon font (TTF/WOFF2) and the highly optimized raw SVGs are strictly typed, significantly reducing space and time complexity when deployed across web clients or document generation pipelines (.docx, .pptx).

## 2. Core Technical Constraint: Font vs. SVG

A strict limitation exists when compiling vector graphics into TTF/WOFF2 formats: **fonts are strictly static and monochrome**.

- **The Font Assets:** The source vector files must be mathematically flattened into single-color silhouettes. Gradients (e.g., `<linearGradient>`) and CSS keyframe animations (e.g., `@keyframes lightning-spark`) are stripped during the build step.
- **The Raw Vector Assets:** If downstream UIs require the animated, multi-colored variants, they will consume the optimized SVG files directly from the CDN payload alongside the font.

## 3. Technology Stack & Tooling

| Layer | Tool |
|---|---|
| Runtime & Orchestrator | **Bun** — blistering file I/O, native TS execution |
| Font Compiler | **Fantasticon** — SVGs → TTF/WOFF2, CSS, TS Enums |
| Vector Optimizer | **SVGO** — aggressive path optimization |
| Distribution | **NPM / unpkg / jsDelivr** — automatic global edge caching |
| UI Framework | **Svelte** — consumes typed TypeScript contracts |

## 4. Package Directory Structure

```text
wmo-icon-font/
├── src/
│   ├── svg-raw/              # Source of truth: flat, monochrome vectors
│   └── registry.json         # Master provenance & attribution contract
├── scripts/
│   ├── build.ts              # Bun orchestration pipeline script
│   └── svgo.config.js        # Minification rules for vectors
├── dist/                     # The ONLY folder published to NPM
│   ├── svg/                  # SVGO-minified SVGs for direct CDN linking
│   ├── fonts/                # Compiled woff2, ttf files
│   ├── wmo-icons.css         # Auto-generated CSS @font-face and classes
│   ├── wmo-icons.json        # Raw codepoint mapping
│   └── index.ts              # Auto-generated TypeScript Enums
├── .fantasticonrc.js         # Fantasticon compiler settings
├── package.json              # NPM configuration
└── README.md                 # Automatically generated attribution markdown
```

## 5. The Master Contract (`registry.json`)

This JSON schema acts as the single source of truth for the entire pipeline, indexing the SVGs and ensuring precise attribution for every graphic.

```json
{
  "icons": [
    {
      "id": "wmo-00-clear-day",
      "wmo_code": "00",
      "description": "Clear sky development (Day)",
      "file": "clear-day.svg",
      "attribution": {
        "author": "Cecil Johnson",
        "license": "Internal/Proprietary",
        "modified": "2026-06-16"
      }
    },
    {
      "id": "wmo-61-rain",
      "wmo_code": "61",
      "description": "Continuous rain, slight",
      "file": "rain.svg",
      "attribution": {
        "author": "Cecil Johnson",
        "license": "Internal/Proprietary",
        "modified": "2026-06-16"
      }
    }
  ]
}
```

## 6. Pipeline Configurations

### A. SVGO Optimization (`scripts/svgo.config.js`)

```javascript
module.exports = {
  multipass: true,
  plugins: [
    'preset-default',
    'removeDimensions',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: { attrs: '(stroke|fill|data-.*)' }
    }
  ]
};
```

### B. Font Compilation (`.fantasticonrc.js`)

```javascript
module.exports = {
  inputDir: './dist/svg',
  outputDir: './dist',
  fontTypes: ['ttf', 'woff2'],
  assetTypes: ['ts', 'css', 'json'],
  name: 'wmo-icons',
  prefix: 'wmo',
  fontsUrl: './fonts',
  formatOptions: {
    ts: {
      types: ['constant', 'enum', 'literalId']
    }
  }
};
```

## 7. The Bun Orchestration Script (`scripts/build.ts`)

```typescript
import { $, file, write } from "bun";

const ORG_NAME = "@your-org/wmo-icon-font";
const CDN_BASE = `https://unpkg.com/${ORG_NAME}/dist/svg`;

console.log("1. Optimizing and Staging SVGs for CDN...");
await $`bunx svgo -f src/svg-raw -o dist/svg --config scripts/svgo.config.js`;

console.log("2. Compiling Font & TypeScript Contracts...");
await $`bunx fantasticon dist/svg -c .fantasticonrc.js`;

console.log("3. Generating Contract README with Attributions...");
const registryText = await file("src/registry.json").text();
const registry = JSON.parse(registryText);

let readme = `# WMO Weather Icon Reference Contract\n\n`;
readme += `> **⚠️ DO NOT EDIT THIS FILE DIRECTLY.**\n`;
readme += `> This README is auto-generated by the build pipeline from \`src/registry.json\`.\n\n`;
readme += `## Asset Inventory & Provenance\n\n`;
readme += `| WMO Code | Condition | Asset ID | Author | Modified | CDN Link |\n`;
readme += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

registry.icons.forEach((icon: any) => {
  const cdnUrl = `${CDN_BASE}/${icon.file}`;
  readme += `| **${icon.wmo_code}** | ${icon.description} | \`${icon.id}\` | ${icon.attribution.author} | ${icon.attribution.modified} | [View SVG](${cdnUrl}) |\n`;
});

await write("README.md", readme);
console.log("Pipeline Complete. Ready for NPM Publish.");
```

## 8. Dynamic WMO Resolution Engine (Client Logic)

```typescript
export type DiurnalState = 'day' | 'night';

export interface WeatherConditionContract {
  wmoCode: number;
  baseDescription: string;
  resolvedIconId: string;
  resolvedGlyphCodepoint: string;
}

export function resolveWmoContract(
  code: number,
  state: DiurnalState,
  cloudCover: number
): WeatherConditionContract {

  if (code >= 0 && code <= 3) {
    const isDay = state === 'day';

    if (cloudCover < 10) {
      return {
        wmoCode: code,
        baseDescription: "Clear Sky / No Clouds",
        resolvedIconId: isDay ? "wmo-clear-day" : "wmo-clear-night",
        resolvedGlyphCodepoint: isDay ? "\\uE001" : "\\uE002"
      };
    } else if (cloudCover >= 10 && cloudCover <= 70) {
      return {
        wmoCode: code,
        baseDescription: "Partly Cloudy",
        resolvedIconId: isDay ? "wmo-partly-cloudy-day" : "wmo-partly-cloudy-night",
        resolvedGlyphCodepoint: isDay ? "\\uE003" : "\\uE004"
      };
    } else {
      return {
        wmoCode: code,
        baseDescription: "Overcast",
        resolvedIconId: "wmo-overcast",
        resolvedGlyphCodepoint: "\\uE005"
      };
    }
  }

  return fetchStaticMapping(code);
}
```

## 9. NPM Distribution

```json
{
  "name": "@your-org/wmo-icon-font",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "style": "dist/wmo-icons.css",
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "bun run scripts/build.ts",
    "prepublishOnly": "bun run build"
  }
}
```

## 10. Downstream UI Integration (Svelte)

```html
<script>
  import '@your-org/wmo-icon-font/dist/wmo-icons.css';
</script>

<script lang="ts">
  import { WmoIcons } from '@your-org/wmo-icon-font';
  export let iconId: WmoIcons;
</script>

<div class="weather-panel glass-card">
  <i class="wmo {iconId}"></i>
</div>

<style>
  .wmo {
    font-size: 48px;
    color: #38bdf8;
  }
</style>
```
