# WMO Icon Font — Architecture & Pipeline

Transitioning from inline SVG symbols in a single HTML file to a distributed, strongly typed font package. Decouples UI (Svelte) from design assets so Word (`.docx`), PowerPoint (`.pptx`), and Web UI all pull from a single source of truth.

---

## 1. Font vs. SVG Animations — Key Constraint

**TrueType (`.ttf`) and WOFF fonts are strictly monochrome and static.** SVGs using `<linearGradient>`, multi-layered paths, or CSS `@keyframes` must be flattened into single-color silhouettes before compilation. If animated / multi-colored versions are needed in the Svelte UI, ship raw SVGs alongside the font.

---

## 2. Tech Stack

| Layer | Tool |
|---|---|
| Runtime & Task Runner | **Bun** — zero-config TS execution, fast I/O |
| Font Compiler | **fantasticon** — generates TTF, WOFF, WOFF2, CSS, TS definitions |
| Vector Optimizer | **svgo** — strips unused tags, gradients, cruft |
| Metadata / Provenance | **JSON schema** → strict TypeScript interfaces |

---

## 3. Source Architecture — Registry & Provenance

Extract SVGs from `<symbol>` tags into `src/svg/`. Maintain a `registry.json` as the single source of truth for attribution and mapping.

### `src/registry.json`

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
    }
  ]
}
```

---

## 4. Compilation Pipeline

### Install dependencies

```bash
bun add -d fantasticon svgo typescript
```

### `.fantasticonrc.js`

```javascript
module.exports = {
  inputDir: './src/svg',
  outputDir: './dist',
  fontTypes: ['ttf', 'woff2'],
  assetTypes: ['ts', 'css', 'json'],
  name: 'wmo-icons',
  prefix: 'wmo',
  fontsUrl: './fonts',
  formatOptions: {
    ts: {
      types: ['constant', 'enum', 'literalId'],
    },
  },
};
```

### Build script — `scripts/build.ts`

```typescript
import { $ } from "bun";

console.log("🧹 Optimizing SVGs...");
await $`bunx svgo -f src/svg -o src/svg-optimized --config svgo.config.js`;

console.log("🔨 Compiling Font & TypeScript Contracts...");
await $`bunx fantasticon src/svg-optimized -c .fantasticonrc.js`;

console.log("✅ Build Complete.");
```

---

## 5. Package Layout & Publishing

### `dist/` output

- `wmo-icons.ttf` — Office / Desktop
- `wmo-icons.woff2` — Web / CDN
- `wmo-icons.css` — CSS `@font-face` rules
- `wmo-icons.ts` — Strictly typed enum + constant
- `wmo-icons.json` — Raw codepoint mapping

### `package.json`

```json
{
  "name": "@your-org/wmo-icon-font",
  "version": "1.0.0",
  "main": "dist/wmo-icons.js",
  "types": "dist/wmo-icons.d.ts",
  "style": "dist/wmo-icons.css",
  "files": ["dist"],
  "scripts": {
    "build": "bun run scripts/build.ts",
    "prepublishOnly": "bun run build"
  }
}
```

Publish with `bun publish`. Available on CDNs at `unpkg.com/@your-org/wmo-icon-font/dist/wmo-icons.css`.

---

## 6. Consumer Integration — Svelte Web UI

### Install

```bash
bun add @your-org/wmo-icon-font
```

### `+layout.svelte` — root import

```html
<script>
  import '@your-org/wmo-icon-font/dist/wmo-icons.css';
</script>
```

### `WeatherCard.svelte` — typed usage

```html
<script lang="ts">
  import { WmoIcons } from '@your-org/wmo-icon-font';
  export let iconId: WmoIcons;
</script>

<div class="weather-panel">
  <i class="wmo {iconId}"></i>
</div>

<style>
  .wmo {
    font-size: 24px;
    color: #38bdf8;
  }
</style>
```

The generated TypeScript enum provides autocomplete and contract safety — removing an icon breaks the build.

---

## Next Steps

1. **Flatten vectors** — Convert CSS-animated, gradient-filled `<symbol>` tags into flat, single-color SVGs.
2. **Setup repository** — Initialize a Bun project, add `fantasticon`, structure `src/svg/` and `registry.json`.
